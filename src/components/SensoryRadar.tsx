type Attribute = {
  label: string
  value: number
}

export function SensoryRadar({
  attributes,
  previewPath,
}: {
  attributes: Attribute[]
  previewPath?: string
}) {
  const points = attributes.slice(0, 6).map((attribute, index) => {
    const angle = (Math.PI * 2 * index) / 6 - Math.PI / 2
    const radius = Math.min(10, Math.max(0, attribute.value)) * 7.5
    return {
      x: 100 + Math.cos(angle) * radius,
      y: 100 + Math.sin(angle) * radius,
    }
  })

  return (
    <div
      className="relative mx-auto aspect-square w-full max-w-72"
      role="img"
      aria-label="Perfil sensorial"
    >
      <svg className="size-full overflow-visible" viewBox="0 0 200 200">
        {[35, 58, 80].map((radius) => (
          <polygon
            fill="none"
            key={radius}
            points={Array.from({ length: 6 }, (_, index) => {
              const angle = (Math.PI * 2 * index) / 6 - Math.PI / 2
              return `${100 + Math.cos(angle) * radius},${100 + Math.sin(angle) * radius}`
            }).join(' ')}
            stroke="currentColor"
            strokeOpacity="0.12"
          />
        ))}
        <polygon
          fill="var(--color-caramel)"
          fillOpacity="0.3"
          points={points.map(({ x, y }) => `${x},${y}`).join(' ')}
          stroke="var(--color-caramel)"
          strokeWidth="2"
        />
        {points.map(({ x, y }, index) => (
          <circle
            cx={x}
            cy={y}
            data-preview-field={previewPath ? `${previewPath}.${index}.value` : undefined}
            fill="var(--color-caramel)"
            key={`${x}-${y}`}
            r="4"
          />
        ))}
      </svg>
      {attributes.slice(0, 6).map((attribute, index) => {
        const positions = [
          'left-1/2 top-0 -translate-x-1/2',
          'right-0 top-1/4',
          'right-0 bottom-1/4',
          'bottom-0 left-1/2 -translate-x-1/2',
          'bottom-1/4 left-0',
          'left-0 top-1/4',
        ]
        return (
          <span
            className={`absolute text-[10px] font-bold uppercase tracking-[0.08em] ${positions[index]}`}
            data-preview-field={previewPath ? `${previewPath}.${index}.label` : undefined}
            key={attribute.label}
          >
            {attribute.label}
          </span>
        )
      })}
    </div>
  )
}
