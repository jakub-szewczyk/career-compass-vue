import type { Shape } from '@/types/resume'
import { Circle, Square, TextCursor } from 'lucide-vue-next'

export enum ShapeName {
  Rect = 'rect',
  Circle = 'circle',
  Text = 'text',
}

enum Anchor {
  TopLeft = 'top-left',
  TopRight = 'top-right',
  BottomLeft = 'bottom-left',
  BottomRight = 'bottom-right',
  MiddleLeft = 'middle-left',
  MiddleRight = 'middle-right',
  TopCenter = 'top-center',
  BottomCenter = 'bottom-center',
}

export const SHAPE_ANCHORS = {
  [ShapeName.Rect]: [
    Anchor.TopLeft,
    Anchor.TopRight,
    Anchor.BottomLeft,
    Anchor.BottomRight,
    Anchor.MiddleLeft,
    Anchor.MiddleRight,
    Anchor.TopCenter,
    Anchor.BottomCenter,
  ],
  [ShapeName.Circle]: [Anchor.TopLeft, Anchor.TopRight, Anchor.BottomLeft, Anchor.BottomRight],
  [ShapeName.Text]: [Anchor.MiddleLeft, Anchor.MiddleRight],
}

export const CONTAINER_HEIGHT = 824

export const TOOLBAR_HEIGHT = 32

export const PAGE_ID = 'page'
export const PAGE_WIDTH = 508.5
export const PAGE_HEIGHT = 720
export const PAGE_FILL = 'white'
export const PAGE_STROKE_WIDTH = 1
export const PAGE_STROKE_COLOR = '#E2E8F0'

export const SELECTION_RECTANGLE_FILL = 'rgba(96,165,250,0.5)'
export const SELECTION_RECTANGLE_STROKE = 'rgb(96,165,250)'
export const SELECTION_RECTANGLE_STROKE_WIDTH = 1

export const SHAPE_FILL = '#CBD5E1'

export const RECT_WIDTH = 100
export const RECT_HEIGHT = RECT_WIDTH

export const CIRCLE_RADIUS = 50

export const TEXT_WIDTH = 175
export const TEXT_FONT_SIZE = 14
export const TEXT_MIN_FONT_SIZE = 8
export const TEXT_MAX_FONT_SIZE = 48
export const TEXT_ALIGN = 'left'
export const TEXT_CONTENT = 'Lorem ipsum dolor sit amet'
export const TEXT_FONT_FAMILY = 'Arial'
export const TEXT_FILL = '#000000'

export const ZOOM_LEVEL = 100
export const MIN_ZOOM_LEVEL = 25
export const MAX_ZOOM_LEVEL = 200
export const ZOOM_LEVEL_STEP = 25

const degreeToRadian = (angle: number) => (angle / 180) * Math.PI

const calculateCorner = (
  pivotX: number,
  pivotY: number,
  diffX: number,
  diffY: number,
  angle: number,
) => {
  const distance = Math.sqrt(diffX * diffX + diffY * diffY)
  angle += Math.atan2(diffY, diffX)
  const x = pivotX + distance * Math.cos(angle)
  const y = pivotY + distance * Math.sin(angle)
  return { x, y }
}

export const getClientRect = ({ x = 0, y = 0, width = 0, height = 0, rotation = 0 }: Shape) => {
  const radian = degreeToRadian(rotation)
  const p1 = calculateCorner(x, y, 0, 0, radian)
  const p2 = calculateCorner(x, y, width, 0, radian)
  const p3 = calculateCorner(x, y, width, height, radian)
  const p4 = calculateCorner(x, y, 0, height, radian)
  const minX = Math.min(p1.x, p2.x, p3.x, p4.x)
  const minY = Math.min(p1.y, p2.y, p3.y, p4.y)
  const maxX = Math.max(p1.x, p2.x, p3.x, p4.x)
  const maxY = Math.max(p1.y, p2.y, p3.y, p4.y)
  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY,
  }
}

export const shapeNameToIcon = (shapeName: ShapeName) => {
  switch (shapeName) {
    case ShapeName.Rect:
      return Square
    case ShapeName.Circle:
      return Circle
    case ShapeName.Text:
      return TextCursor
  }
}

export const prettifyShapeName = (shapeName: ShapeName) => {
  switch (shapeName) {
    case ShapeName.Rect:
      return 'Rectangle'
    case ShapeName.Circle:
      return 'Circle'
    case ShapeName.Text:
      return 'Text'
  }
}
