type Item = {
  game_id: string;
  screenshot_id: string;
  vis_id: string;
  data: Data[];
  marks: Mark[];
  channels: Channel[][];
  vis_name: String;
  vis_usage: VisUsage[];
  vis_position: Position[];
  vis_visibility: VisibilityEphemerality[];
  notes: string[];
};

type Colour = "Hue" | "Saturation" | "Lightness";

type Data = {
  data_value: string;
  data_type: "Spatial" | "Ordinal" | "Quantitative" | "Nominal" | "Temporal";
};

type Mark =
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

type Channel =
  | "Position"
  | "Length"
  | "Angle"
  | "Area"
  | "Depth"
  | "Curvature"
  | "Volume"
  | "Shape"
  | Colour[];

type VisUsage = "Environment" | "Enemy" | "Game" | "Player";

type Position = RelativePosition | ScreenPosition;

type RelativePosition = {
  screen_relativity: "Relative";
  screen_position: string;
  coords: "Camera" | "World";
};
type ScreenPosition = {
  screen_relativity: "Screen";
  screen_position: ["Bottom" | "Middle" | "Top", "Left" | "Middle" | "Right"];
  coords: "Camera" | "World";
};

type VisibilityEphemerality = ["Global" | "Local", boolean];
