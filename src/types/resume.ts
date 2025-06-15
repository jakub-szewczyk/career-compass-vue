import type { ShapeConfig } from 'konva/lib/Shape'

export type Shape = ShapeConfig & { id: string }

export type Box = Required<Pick<Shape, 'width' | 'height'>>
