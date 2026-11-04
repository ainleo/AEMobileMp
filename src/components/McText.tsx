import { useMemo } from 'react'
import { Text } from '@tarojs/components'
import { parseMc } from '@/lib/mcformat'

/** 渲染带 Minecraft § 颜色码的文本 */
export function McText({ text, baseColor }: { text: string; baseColor?: string }) {
  const segs = useMemo(() => parseMc(text), [text])
  return (
    <Text>
      {segs.map((s, i) => (
        <Text
          key={i}
          style={
            {
              color: s.color || baseColor,
              fontWeight: s.bold ? '700' : '400',
              fontStyle: s.italic ? 'italic' : 'normal',
              textDecoration: [s.underline ? 'underline' : '', s.strike ? 'line-through' : '']
                .filter(Boolean)
                .join(' ') || 'none'
            } as any
          }
        >
          {s.text}
        </Text>
      ))}
    </Text>
  )
}
