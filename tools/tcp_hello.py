"""TCP 连接 + AEMobile 协议 v3 HELLO 握手测试。"""
import json
import socket
import struct
import sys

host = sys.argv[1]
port = int(sys.argv[2])
timeout = float(sys.argv[3]) if len(sys.argv) > 3 else 8.0

print(f"connect {host}:{port} ...")
s = socket.create_connection((host, port), timeout=timeout)
print("tcp connected")

payload = json.dumps({"v": 3, "app": "AEMobileApp/3.0.0"}).encode("utf-8")
frame = struct.pack(">i", 2 + len(payload)) + bytes([0x01, 0x00]) + payload
s.sendall(frame)
print("HELLO sent")

s.settimeout(timeout)


def recv_exact(n):
    buf = b""
    while len(buf) < n:
        chunk = s.recv(n - len(buf))
        if not chunk:
            raise EOFError("connection closed")
        buf += chunk
    return buf


hdr = recv_exact(4)
length = struct.unpack(">i", hdr)[0]
body = recv_exact(length)
ftype = body[0]
flags = body[1]
data = body[2:]
print("frame_length", length, "type", hex(ftype), "flags", flags)
print("payload:", data.decode("utf-8", "ignore"))
s.close()
print("done")
