"""以游客身份连接 AEMobile 服务器，订阅 chat 流，打印实时推送。"""
import json
import socket
import struct
import sys
import time

host = sys.argv[1]
port = int(sys.argv[2])
dur = float(sys.argv[3]) if len(sys.argv) > 3 else 8.0
out_path = sys.argv[4] if len(sys.argv) > 4 else ""

lines = []


def log(s):
    print(s)
    lines.append(s)


T = {
    0x01: "HELLO", 0x02: "HELLO_ACK", 0x03: "AUTH", 0x04: "AUTH_OK",
    0x05: "AUTH_FAIL", 0x10: "REQ", 0x11: "RES", 0x20: "SUB", 0x21: "SUB_OK",
    0x22: "PUSH", 0x23: "UNSUB", 0x30: "PING", 0x31: "PONG", 0x40: "ERR",
}


def send_frame(sock, typ, obj):
    payload = b"" if obj is None else json.dumps(obj, ensure_ascii=False).encode("utf-8")
    sock.sendall(struct.pack(">i", 2 + len(payload)) + bytes([typ, 0]) + payload)


def recv_exact(sock, n):
    buf = b""
    while len(buf) < n:
        chunk = sock.recv(n - len(buf))
        if not chunk:
            raise EOFError("closed")
        buf += chunk
    return buf


def recv_frame(sock):
    hdr = recv_exact(sock, 4)
    length = struct.unpack(">i", hdr)[0]
    body = recv_exact(sock, length)
    return body[0], body[2:].decode("utf-8", "ignore")


s = socket.create_connection((host, port), timeout=8)
log(f"tcp connected {host}:{port}")
send_frame(s, 0x01, {"v": 3, "app": "AEMobileApp/3.0.0"})
t, data = recv_frame(s)
log(f"HELLO_ACK[{T.get(t)}] {data}")
send_frame(s, 0x03, {"guest": True})
s.settimeout(3)
while True:
    t, data = recv_frame(s)
    log(f"auth<- [{T.get(t)}] {data}")
    if t in (0x04, 0x05):
        break
send_frame(s, 0x20, {"id": 1, "op": "chat", "p": {"since": 0, "boot": 0}, "sid": ""})
log("SUB chat sent")
s.settimeout(1.0)
end = time.time() + dur
count = 0
while time.time() < end:
    try:
        t, data = recv_frame(s)
    except socket.timeout:
        continue
    except Exception as e:
        log(f"read end: {e}")
        break
    name = T.get(t, hex(t))
    if t == 0x22:
        count += 1
        log(f"PUSH {data[:600]}")
    else:
        log(f"<- [{name}] {data[:300]}")
log(f"done, push_count={count}")
s.close()

if out_path:
    with open(out_path, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))
