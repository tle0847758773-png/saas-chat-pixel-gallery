export const VIDEO_FPS = 60;
export const VIDEO_WIDTH = 1920;
export const VIDEO_HEIGHT = 1080;
export const VIDEO_DURATION = 1655;

export const SCENES = {
  train: {from: 0, duration: 75},
  chatgpt: {from: 75, duration: 123},
  scrollList1: {from: 198, duration: 93},
  sonicMat1: {from: 291, duration: 45},
  editor: {from: 336, duration: 180},
  kineticDome: {from: 516, duration: 189},
  gallery1: {from: 705, duration: 135},
  slicesSofa: {from: 840, duration: 153},
  threeBadge: {from: 993, duration: 99},
  sonicMat2: {from: 1092, duration: 69},
  gallery2: {from: 1161, duration: 75},
  layerWriting: {from: 1236, duration: 183},
  scrollList2: {from: 1419, duration: 87},
  sonicMat3: {from: 1506, duration: 75},
  splitEyes: {from: 1581, duration: 74},
} as const;

export const COLORS = {
  creamBg: '#FBFEF5',
  oliveText: '#374D14',
  limeDome: '#B5F234',
  matGreen: '#283F38',
  matTrim: '#A99982',
  deskWood: '#6E5B45',
  chalkGreen: '#91D925',
  madDisc: '#E1D9CA',
  sonicOrange: '#F06E1E',
  sonicOrangeDeep: '#D65210',
  sonicOrangeShadow: '#B9420A',
  sonicBlue: '#4EBDE4',
  sonicGold: '#ECC947',
  sonicButtonDark: '#1E3741',
  selectionCyan: '#5DB8FA',
  editorLimeGlow: '#E2FEB3',
  editorThumbBorder: '#A2D92F',
  chatgptBgLeft: '#B7C18A',
  chatgptBgRight: '#87987A',
  chatgptPole: '#BA734E',
  chatgptTealBeam: '#204942',
  chatgptCard: '#FAF9F7',
  sliceBackdrop: '#DCDCD4',
  salmonDot: '#F38B78',
  dimDot: '#7F4A42',
} as const;

export const FONTS = {
  sans: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  condensed: '"Anton", "Inter", sans-serif',
} as const;

export const GALLERY_IMAGES = [
  'assets/gallery-red-jacket.jpg',
  'assets/gallery-cta-train.jpg',
  'assets/gallery-warm-cafe.jpg',
  'assets/gallery-architecture.jpg',
  'assets/gallery-city-dusk.jpg',
  'assets/gallery-bokeh.jpg',
] as const;
