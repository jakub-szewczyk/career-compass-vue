<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { intersection, uniqueId } from 'lodash'
import { nextTick } from 'vue'
import { onMounted } from 'vue'
import { ref, watch, reactive } from 'vue'
import Konva from 'konva'
import type { KonvaEventObject } from 'konva/lib/Node'
import { computed } from 'vue'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import type { Box, Shape } from '@/types/resume'
import {
  TEXT_ALIGN,
  CIRCLE_RADIUS,
  CONTAINER_HEIGHT,
  getClientRect,
  PAGE_FILL,
  PAGE_HEIGHT,
  PAGE_ID,
  PAGE_STROKE_COLOR,
  PAGE_STROKE_WIDTH,
  PAGE_WIDTH,
  RECT_HEIGHT,
  RECT_WIDTH,
  SELECTION_RECTANGLE_FILL,
  SELECTION_RECTANGLE_STROKE,
  SELECTION_RECTANGLE_STROKE_WIDTH,
  SHAPE_ANCHORS,
  SHAPE_FILL,
  ShapeName,
  TEXT_CONTENT,
  TEXT_FILL,
  TEXT_FONT_SIZE,
  TEXT_WIDTH,
  TOOLBAR_HEIGHT,
  TEXT_FONT_FAMILY,
  TEXT_MAX_FONT_SIZE,
  TEXT_MIN_FONT_SIZE,
} from '@/modules/resume'
import { useTemplateRef } from 'vue'
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Circle,
  Italic,
  Square,
  Strikethrough,
  Trash,
  Type,
  Underline,
  ZoomIn,
  ZoomOut,
} from 'lucide-vue-next'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import type { AcceptableValue } from 'reka-ui'
import {
  NumberField,
  NumberFieldContent,
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldInput,
} from '@/components/ui/number-field'

// TODO:
// - text alignment
// - text font size
// - text font family
// - layering
// - clipping
// - persistence
// - more shapes
// - RWD (take collapsable sidebar into account)
// - context menu
// - keyboard shortcuts
// - images
const containerRef = useTemplateRef('containerRef')
const pageRef = useTemplateRef('pageRef')
const stageRef = useTemplateRef('stageRef')
const rectRefs = useTemplateRef('rectRefs')
const circleRefs = useTemplateRef('circleRefs')
const textRefs = useTemplateRef('textRefs')
const transformerRef = useTemplateRef('transformerRef')

const stageConfig = ref({ width: 0, height: 0 })
const allShapes = ref<Shape[]>([])
const selectedIds = ref<string[]>([])
const isSelecting = ref(false)
const selectionRectangle = reactive({
  visible: false,
  x1: 0,
  y1: 0,
  x2: 0,
  y2: 0,
})

const selectedRect = computed(() => {
  if (selectedIds.value.length === 1) {
    const shape = allShapes.value.find(({ id }) => id === selectedIds.value[0])
    if (shape && shape.id.includes(ShapeName.Rect)) return shape
  }
})
const selectedCircle = computed(() => {
  if (selectedIds.value.length === 1) {
    const shape = allShapes.value.find(({ id }) => id === selectedIds.value[0])
    if (shape && shape.id.includes(ShapeName.Circle)) return shape
  }
})
const selectedText = computed(() => {
  if (selectedIds.value.length === 1) {
    const shape = allShapes.value.find(({ id }) => id === selectedIds.value[0])
    if (shape && shape.id.includes(ShapeName.Text)) return shape
  }
})

const colorPreview = computed(
  () =>
    selectedRect?.value?.fill ||
    selectedCircle?.value?.fill ||
    selectedText?.value?.fill ||
    TEXT_FILL,
)

// FIXME: Shape ref type
onMounted(() => {
  if (!containerRef.value || !pageRef.value || !stageRef.value) return
  stageConfig.value.width = containerRef.value?.getBoundingClientRect().width || 0
  stageConfig.value.height = containerRef.value?.getBoundingClientRect().height || 0
  const page = pageRef.value.getNode()
  page.attrs.width = PAGE_WIDTH
  page.attrs.height = PAGE_HEIGHT
  page.x(stageConfig.value.width / 2 - PAGE_WIDTH / 2)
  page.y(stageConfig.value.height / 2 - PAGE_HEIGHT / 2)
  page.attrs.fill = PAGE_FILL
  page.strokeWidth(PAGE_STROKE_WIDTH)
  page.stroke(PAGE_STROKE_COLOR)
})

// FIXME: Shape ref types
watch(selectedIds, () => {
  if (!transformerRef.value) return
  const nodes = selectedIds.value
    .map((selectedId) => {
      const shape = allShapes.value.find(({ id }) => id === selectedId)
      if (!shape) return null
      if (shape.id.includes(ShapeName.Rect))
        return rectRefs.value
          ?.find((rectRef) => rectRef.getNode().attrs.id === selectedId)
          ?.getNode()
      if (shape.id.includes(ShapeName.Text))
        return textRefs.value
          .find((textRef) => textRef.getNode().attrs.id === selectedId)
          ?.getNode()
      if (shape.id.includes(ShapeName.Circle))
        return circleRefs.value
          .find((circleRef) => circleRef.getNode().attrs.id === selectedId)
          ?.getNode()
      return null
    })
    .filter(Boolean)
  const transformer = transformerRef.value.getNode()
  transformer.nodes(nodes)
  if (nodes.length === 1) transformer.enabledAnchors(SHAPE_ANCHORS[nodes[0].name() as ShapeName])
  if (nodes.length > 1)
    transformer.enabledAnchors(
      intersection(...nodes.map((node) => SHAPE_ANCHORS[node.name() as ShapeName])),
    )
})

const handleStageClick = (event: KonvaEventObject<MouseEvent>) => {
  if (selectionRectangle.visible) return
  if (event.target === event.target.getStage() || event.target.attrs.id === PAGE_ID)
    return (selectedIds.value = [])
  if (
    !event.target.hasName(ShapeName.Rect) &&
    !event.target.hasName(ShapeName.Text) &&
    !event.target.hasName(ShapeName.Circle)
  )
    return
  const clickedId = event.target.attrs.id
  const isSelected = selectedIds.value.includes(clickedId)
  const isMetaPressed = event.evt.shiftKey || event.evt.ctrlKey || event.evt.metaKey
  if (!isSelected && !isMetaPressed) selectedIds.value = [clickedId]
  if (isSelected && isMetaPressed)
    selectedIds.value = selectedIds.value.filter((selectedId) => selectedId !== clickedId)
  if (!isSelected && isMetaPressed) selectedIds.value = [...selectedIds.value, clickedId]
}

const handleMouseDown = (event: KonvaEventObject<MouseEvent>) => {
  if (event.target !== event.target.getStage() && event.target.attrs.id !== PAGE_ID) return
  isSelecting.value = true
  const stage = event.target.getStage()
  if (!stage) return
  const position = stage.getPointerPosition()
  if (!position) return
  selectionRectangle.visible = true
  selectionRectangle.x1 = position.x
  selectionRectangle.y1 = position.y
  selectionRectangle.x2 = position.x
  selectionRectangle.y2 = position.y
}

const handleMouseMove = (event: KonvaEventObject<MouseEvent>) => {
  if (!isSelecting.value) return
  const stage = event.target.getStage()
  if (!stage) return
  const position = stage.getPointerPosition()
  if (!position) return
  selectionRectangle.x2 = position.x
  selectionRectangle.y2 = position.y
}

const handleMouseUp = () => {
  if (!isSelecting.value) return
  isSelecting.value = false
  setTimeout(() => (selectionRectangle.visible = false))
  const selectionBox = {
    x: Math.min(selectionRectangle.x1, selectionRectangle.x2),
    y: Math.min(selectionRectangle.y1, selectionRectangle.y2),
    width: Math.abs(selectionRectangle.x2 - selectionRectangle.x1),
    height: Math.abs(selectionRectangle.y2 - selectionRectangle.y1),
  }
  const selectedShape = allShapes.value.filter((shape) =>
    Konva.Util.haveIntersection(selectionBox, getClientRect(shape)),
  )
  selectedIds.value = selectedShape.map(({ id }) => id)
}

const handleDragStart = (event: KonvaEventObject<DragEvent>) => {
  const clickedId = event.target.attrs.id
  if (!selectedIds.value.includes(clickedId)) selectedIds.value = [clickedId]
}

const handleDragEnd = (event: KonvaEventObject<DragEvent>) => {
  const shapes = [...allShapes.value]
  const index = shapes.findIndex(({ id }) => id === event.target.attrs.id)
  if (index === -1) return
  shapes[index] = {
    ...shapes[index],
    x: event.target.x(),
    y: event.target.y(),
  }
  allShapes.value = shapes
}

// FIXME: Shapes ref type
const handleTransform = (event: KonvaEventObject<Event>) => {
  const shape = allShapes.value.find(({ id }) => id === event.target.attrs.id)
  if (!shape) return
  const node = textRefs.value.find((textRef) => textRef.getNode().attrs.id === shape?.id)?.getNode()
  shape.width = node.width() * node.scaleX()
  node.setAttrs({
    width: node.width() * node.scaleX(),
    scaleX: 1,
  })
}

const handleTransformEnd = (event: KonvaEventObject<Event>) => {
  const shapes = [...allShapes.value]
  const isRect = event.target.hasName(ShapeName.Rect)
  const index = shapes.findIndex(({ id }) => id === event.target.attrs.id)
  if (index === -1) return
  const node = event.target
  const scaleX = node.scaleX()
  const scaleY = node.scaleY()
  node.scaleX(1)
  node.scaleY(1)
  shapes[index] = {
    ...shapes[index],
    x: node.x(),
    y: node.y(),
    width: Math.max(5, node.width() * scaleX),
    ...(isRect ? { height: Math.max(node.height() * scaleY) } : {}),
    rotation: node.rotation(),
  }
  allShapes.value = shapes
}

const handleRectAdd = async () => {
  const id = uniqueId(ShapeName.Rect)
  allShapes.value.push({
    id,
    name: ShapeName.Rect,
    x: stageConfig.value.width / 2 - RECT_WIDTH / 2,
    y: stageConfig.value.height / 2 - RECT_HEIGHT / 2,
    width: RECT_WIDTH,
    height: RECT_HEIGHT,
    fill: SHAPE_FILL,
    draggable: true,
  })
  await nextTick(() => (selectedIds.value = [id]))
}

const handleCircleAdd = async () => {
  const id = uniqueId(ShapeName.Circle)
  allShapes.value.push({
    id,
    name: ShapeName.Circle,
    x: stageConfig.value.width / 2,
    y: stageConfig.value.height / 2,
    radius: CIRCLE_RADIUS,
    fill: SHAPE_FILL,
    draggable: true,
  })
  await nextTick(() => (selectedIds.value = [id]))
}

const handleTextAdd = async () => {
  const id = uniqueId(ShapeName.Text)
  allShapes.value.push({
    id,
    name: ShapeName.Text,
    x: stageConfig.value.width / 2 - TEXT_WIDTH / 2,
    y: stageConfig.value.height / 2 - TEXT_FONT_SIZE / 2,
    width: TEXT_WIDTH,
    fontSize: TEXT_FONT_SIZE,
    align: TEXT_ALIGN,
    text: TEXT_CONTENT,
    fontFamily: TEXT_FONT_FAMILY,
    draggable: true,
  })
  await nextTick(() => (selectedIds.value = [id]))
}

const handleTextUpdate = (value: string | number) => {
  const shape = allShapes.value.find(({ id }) => id === selectedText.value?.id)
  if (!shape) return
  shape.text = value
}

// FIXME: Event object type
const handleTextBlur = (event: FocusEvent) => {
  if (event.target.value) return
  allShapes.value = allShapes.value.filter(({ id }) => !selectedIds.value.includes(id))
}

const handleColorUpdate = (value: string | number) => {
  if (typeof value !== 'string') return
  if (selectedRect.value) selectedRect.value.fill = value
  if (selectedCircle.value) selectedCircle.value.fill = value
  if (selectedText.value) selectedText.value.fill = value
}

const handleSelectedDelete = () => {
  allShapes.value = allShapes.value.filter(({ id }) => !selectedIds.value.includes(id))
  selectedIds.value = []
}

const handleTextAlignChange = (payload: AcceptableValue | AcceptableValue[]) => {
  if (selectedText.value) selectedText.value.align = payload
}

const handleFontStyleChange = (payload: AcceptableValue | AcceptableValue[]) => {
  if (!selectedText.value) return
  if (Array.isArray(payload)) {
    selectedText.value.fontStyle = undefined
    if (payload.includes('bold') && payload.includes('italic'))
      return (selectedText.value.fontStyle = 'italic bold')
    return payload.forEach((value) => (selectedText.value!.fontStyle = value))
  }
  selectedText.value.textDecoration = payload
}

const handleFontFamilyChange = (value: AcceptableValue) => {
  if (!selectedText.value) return
  selectedText.value.fontFamily = value
}

const handleFontSizeChange = (value: AcceptableValue) => {
  if (!selectedText.value) return
  selectedText.value.fontSize = value
}
</script>

<template>
  <div
    :style="{ height: `${CONTAINER_HEIGHT}px` }"
    class="relative flex overflow-hidden rounded-sm border border-slate-200 bg-slate-50"
  >
    <div ref="containerRef" class="size-full">
      <div
        :style="{
          height: `${TOOLBAR_HEIGHT}px`,
          top: `${((CONTAINER_HEIGHT - PAGE_HEIGHT) / 2 - TOOLBAR_HEIGHT) / 2}px`,
          left: `${stageConfig.width / 2 - TOOLBAR_HEIGHT * 2}px`,
        }"
        class="absolute z-50 flex w-8 -translate-x-1/2 transition-none"
      >
        <Button
          class="size-full rounded-r-none bg-white"
          size="icon"
          variant="outline"
          @click="handleRectAdd"
        >
          <Square />
        </Button>
        <Button
          class="size-full rounded-none border-l-0 bg-white"
          size="icon"
          variant="outline"
          @click="handleCircleAdd"
        >
          <Circle />
        </Button>
        <Button
          class="size-full rounded-none border-l-0 bg-white"
          size="icon"
          variant="outline"
          @click="handleTextAdd"
        >
          <Type />
        </Button>
        <Button
          class="size-full rounded-none border-l-0 bg-white"
          size="icon"
          variant="outline"
          :disabled="selectedIds.length !== 1"
        >
          <label class="flex size-full cursor-pointer items-center justify-center">
            <div :style="{ backgroundColor: colorPreview.toString() }" class="size-1/2 shrink-0" />
            <Input
              class="invisible size-0 border-0 p-0"
              type="color"
              :value="selectedRect?.fill || selectedCircle?.fill || selectedText?.fill || TEXT_FILL"
              @update:model-value="handleColorUpdate"
            />
          </label>
        </Button>
        <Button
          class="text-destructive size-full rounded-l-none border-l-0 bg-white"
          size="icon"
          variant="outline"
          :disabled="selectedIds.length === 0"
          @click="handleSelectedDelete"
        >
          <Trash />
        </Button>
      </div>

      <v-stage
        ref="stageRef"
        :config="stageConfig"
        @click="handleStageClick"
        @mousedown="handleMouseDown"
        @mousemove="handleMouseMove"
        @mouseup="handleMouseUp"
      >
        <v-layer>
          <v-rect :id="PAGE_ID" ref="pageRef" />
          <v-rect
            ref="rectRefs"
            v-for="rect in allShapes.filter(({ id }) => id.includes(ShapeName.Rect))"
            :key="rect.id"
            :config="rect"
            @dragstart="handleDragStart"
            @dragend="handleDragEnd"
            @transformend="handleTransformEnd"
          />
          <v-circle
            ref="circleRefs"
            v-for="circle in allShapes.filter(({ id }) => id.includes(ShapeName.Circle))"
            :key="circle.id"
            :config="circle"
            @dragstart="handleDragStart"
            @dragend="handleDragEnd"
            @transformend="handleTransformEnd"
          />
          <v-text
            ref="textRefs"
            v-for="text in allShapes.filter(({ id }) => id.includes(ShapeName.Text))"
            :key="text.id"
            :config="text"
            @dragstart="handleDragStart"
            @dragend="handleDragEnd"
            @transform="handleTransform"
            @transformend="handleTransformEnd"
          />
          <v-transformer
            ref="transformerRef"
            :config="{
              shouldOverdrawWholeArea: true,
              boundBoxFunc: (oldBox: Box, newBox: Box) =>
                newBox.width < 5 || newBox.height < 5 ? oldBox : newBox,
            }"
          />
          <v-rect
            v-if="selectionRectangle.visible"
            :config="{
              x: Math.min(selectionRectangle.x1, selectionRectangle.x2),
              y: Math.min(selectionRectangle.y1, selectionRectangle.y2),
              width: Math.abs(selectionRectangle.x2 - selectionRectangle.x1),
              height: Math.abs(selectionRectangle.y2 - selectionRectangle.y1),
              fill: SELECTION_RECTANGLE_FILL,
              stroke: SELECTION_RECTANGLE_STROKE,
              strokeWidth: SELECTION_RECTANGLE_STROKE_WIDTH,
            }"
          />
        </v-layer>
      </v-stage>

      <div
        :style="{
          height: `${TOOLBAR_HEIGHT}px`,
          bottom: `${((CONTAINER_HEIGHT - PAGE_HEIGHT) / 2 - TOOLBAR_HEIGHT) / 2}px`,
          left: `${stageConfig.width / 2 - TOOLBAR_HEIGHT * 1.5}px`,
        }"
        class="absolute z-50 flex w-8 -translate-x-1/2 transition-none"
      >
        <Button class="size-full rounded-r-none bg-white" size="icon" variant="outline">
          <ZoomOut />
        </Button>
        <Button
          tabindex="-1"
          class="pointer-events-none size-full w-[60px] rounded-none border-l-0 bg-white text-xs"
          size="icon"
          variant="outline"
        >
          <label class="flex size-full cursor-pointer items-center justify-center">
            <div class="size-1/2 shrink-0">100%</div>
            <Input hidden type="number" :value="100" />
          </label>
        </Button>
        <Button class="size-full rounded-l-none border-l-0 bg-white" size="icon" variant="outline">
          <ZoomIn />
        </Button>
      </div>
    </div>
    <div class="flex w-[300px] flex-col gap-y-2 border-l-1 border-l-slate-200 bg-white p-4">
      <h2 class="flex items-center gap-x-2 text-sm"><Type class="size-4" /> Typography</h2>
      <Separator />
      <div class="flex">
        <ToggleGroup
          type="single"
          :disabled="!selectedText"
          :model-value="selectedText?.align"
          @update:model-value="handleTextAlignChange"
        >
          <ToggleGroupItem class="size-8 rounded-r-none bg-white" variant="outline" value="left">
            <AlignLeft />
          </ToggleGroupItem>
          <ToggleGroupItem class="size-8 rounded-r-none bg-white" variant="outline" value="center">
            <AlignCenter />
          </ToggleGroupItem>
          <ToggleGroupItem class="size-8 rounded-r-none bg-white" variant="outline" value="right">
            <AlignRight />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      <div class="flex">
        <ToggleGroup
          type="multiple"
          :disabled="!selectedText"
          :model-value="
            selectedText?.fontStyle === 'italic bold'
              ? ['bold', 'italic']
              : [selectedText?.fontStyle]
          "
          @update:model-value="handleFontStyleChange"
        >
          <ToggleGroupItem class="size-8 rounded-r-none bg-white" variant="outline" value="bold">
            <Bold />
          </ToggleGroupItem>
          <ToggleGroupItem class="size-8 !rounded-r-none bg-white" variant="outline" value="italic">
            <Italic />
          </ToggleGroupItem>
        </ToggleGroup>
        <ToggleGroup
          type="single"
          :disabled="!selectedText"
          :model-value="selectedText?.textDecoration"
          @update:model-value="handleFontStyleChange"
        >
          <ToggleGroupItem
            class="size-8 !rounded-l-none rounded-r-none !border-l-0 bg-white"
            variant="outline"
            value="underline"
          >
            <Underline />
          </ToggleGroupItem>
          <ToggleGroupItem
            class="size-8 rounded-r-none bg-white"
            variant="outline"
            value="line-through"
          >
            <Strikethrough />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      <div class="flex flex-col gap-y-1.5">
        <NumberField
          id="fontSize"
          class="w-fit [&_input]:h-[32px]"
          :disabled="!selectedText"
          :min="TEXT_MIN_FONT_SIZE"
          :max="TEXT_MAX_FONT_SIZE"
          :model-value="selectedText?.fontSize || TEXT_FONT_SIZE"
          @update:model-value="handleFontSizeChange"
        >
          <Label for="fontSize">Size</Label>
          <NumberFieldContent>
            <NumberFieldDecrement class="cursor-pointer" />
            <NumberFieldInput />
            <NumberFieldIncrement class="cursor-pointer" />
          </NumberFieldContent>
        </NumberField>
      </div>
      <div class="flex flex-col gap-y-1.5">
        <SelectLabel for="font-family" class="p-0">Family</SelectLabel>
        <Select
          :disabled="!selectedText"
          :model-value="selectedText?.fontFamily"
          @update:model-value="handleFontFamilyChange"
        >
          <SelectTrigger class="w-full" size="sm">
            <SelectValue
              :style="{ fontFamily: selectedText?.fontFamily }"
              placeholder="Select font family"
            />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem class="font-[Arial]" value="Arial"> Arial </SelectItem>
              <SelectItem class="font-[Times_New_Roman]" value="Times New Roman">
                Times New Roman
              </SelectItem>
              <SelectItem class="font-[Courier_New]" value="Courier New"> Courier New </SelectItem>
              <SelectItem class="font-[Verdana]" value="Verdana"> Verdana </SelectItem>
              <SelectItem class="font-[Georgia]" value="Georgia"> Georgia </SelectItem>
              <SelectItem class="font-[Palatino]" value="Palatino"> Palatino </SelectItem>
              <SelectItem class="font-[Garamond]" value="Garamond"> Garamond </SelectItem>
              <SelectItem class="font-[Comic_Sans_MS]" value="Comic Sans MS">
                Comic Sans MS
              </SelectItem>
              <SelectItem class="font-[Trebuchet_MS]" value="Trebuchet MS">
                Trebuchet MS
              </SelectItem>
              <SelectItem class="font-[Arial_Black]" value="Arial Black"> Arial Black </SelectItem>
              <SelectItem class="font-[Impact]" value="Impact"> Impact </SelectItem>
              <SelectItem class="font-[PT_Sans]" value="PT Sans"> PT Sans </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div class="flex flex-col gap-y-1.5">
        <Label>Content</Label>
        <Textarea
          class="max-h-16 resize-none break-all"
          :disabled="!selectedText"
          :value="selectedText?.text"
          @update:model-value="handleTextUpdate"
          @blur="handleTextBlur"
        />
      </div>
    </div>
  </div>
</template>
