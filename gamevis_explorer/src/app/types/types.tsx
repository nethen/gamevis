export type Annotation = {
  game_id: string;
  screenshot_id: string;
  vis_id: string;
  data: Data[][];
  marks: Mark[][];
  channels: Channel[][];
  vis_name: String;
  vis_usage: VisUsage[];
  vis_position: Position;
  vis_visibility: VisibilityEphemerality[];
  notes: string[];
  tags?: string[];
  flagged?: boolean;
};

export type Data = {
  data_value: string;
  data_type: "Spatial" | "Ordinal" | "Quantitative" | "Nominal" | "Temporal";
};

export type Mark = PrimitiveMark | ArrayMark;

export type PrimitiveMark =
  | "Arc"
  | "Area"
  | "Circle"
  | "Image"
  | "Line"
  | "Path"
  | "Rectangle"
  | "Rule"
  | "Symbol"
  | "Text"
  | "Trail";

export type ArrayMark =
  | "Arc_Array"
  | "Area_Array"
  | "Circle_Array"
  | "Image_Array"
  | "Line_Array"
  | "Path_Array"
  | "Rectangle_Array"
  | "Rule_Array"
  | "Symbol_Array"
  | "Text_Array"
  | "Trail_Array";

export type Channel =
  | "Position"
  | "Length"
  | "Angle"
  | "Area"
  | "Depth"
  | "Curvature"
  | "Size"
  | "Volume"
  | "Shape"
  | "Text"
  | "Hue"
  | "Saturation"
  | "Luminance"
  | "Colour"
  | "Image";

export type VisUsage = "Environment" | "Enemy" | "Game" | "Player";

type Position = {
  screen_relativity: string;
  coords: string;
  relative_to?: string;
  screen_position?: ["Top" | "Middle" | "Bottom", "Left" | "Middle" | "Right"];
  relative_position?: [
    "Top" | "Middle" | "Bottom",
    "Left" | "Middle" | "Right"
  ];
};

type VisibilityEphemerality = ["Global" | "Local", boolean];
