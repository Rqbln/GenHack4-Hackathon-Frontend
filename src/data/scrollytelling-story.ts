import type { ScrollStep } from '../components/Scrollytelling'

/**
 * Scrollytelling narrative script for GenHack 2025
 * Tells the story of Urban Heat Islands and our solution
 */
export const scrollytellingStory: ScrollStep[] = [
  {
    id: 'intro',
    title: 'The Urban Heat Island Challenge',
    content: 'Cities are getting hotter. The Urban Heat Island (UHI) effect creates temperature differences of up to 4°C between urban and rural areas, with devastating impacts on health, energy consumption, and climate resilience.',
    mapViewState: {
      longitude: 2.3522,
      latitude: 48.8566,
      zoom: 10
    },
    highlight: [
      '4°C temperature difference between urban and rural areas',
      'Increased health risks and energy consumption',
      'Need for high-resolution climate data'
    ]
  },
  {
    id: 'problem',
    title: 'The Data Gap',
    content: 'Global weather models like ERA5 provide data at 9km resolution - too coarse to capture street-level variations. Ground stations are sparse. We need a way to bridge this gap.',
    mapViewState: {
      longitude: 2.3522,
      latitude: 48.8566,
      zoom: 11
    },
    highlight: [
      'ERA5: 9km resolution (too coarse)',
      'Ground stations: Sparse coverage',
      'Street-level data: Missing'
    ]
  },
  {
    id: 'solution',
    title: 'Chronos-WxC: AI-Powered Downscaling',
    content: 'We use Prithvi WxC, a 2.3B parameter Vision Transformer pre-trained on decades of climate data. Fine-tuned with QLoRA, it learns to downscale global models to street-level resolution using satellite imagery and physical constraints.',
    mapViewState: {
      longitude: 2.3522,
      latitude: 48.8566,
      zoom: 12
    },
    highlight: [
      'Foundation Model: Prithvi WxC (2.3B parameters)',
      'Efficient Fine-tuning: QLoRA (1% of parameters)',
      'Physics-Informed: Respects physical laws'
    ]
  },
  {
    id: 'data',
    title: 'Multi-Source Data Integration',
    content: 'We combine ERA5 climate data, Sentinel-2 vegetation maps (NDVI), and ECA&D ground truth stations. Random Forest gap-filling ensures complete temporal coverage even with cloud cover.',
    mapViewState: {
      longitude: 2.3522,
      latitude: 48.8566,
      zoom: 11
    },
    highlight: [
      'ERA5: Temperature, wind, precipitation',
      'Sentinel-2: Vegetation index (NDVI)',
      'ECA&D: Ground truth validation'
    ]
  },
  {
    id: 'results',
    title: 'Precision at Scale',
    content: 'Our model achieves superior performance compared to baseline interpolation methods, with improved accuracy for extreme events - critical for heat wave prediction and urban planning.',
    mapViewState: {
      longitude: 2.3522,
      latitude: 48.8566,
      zoom: 13
    },
    highlight: [
      'Higher resolution: 100m vs 9km',
      'Better extreme event prediction',
      'Validated against ground truth'
    ]
  },
  {
    id: 'impact',
    title: 'Actionable Insights',
    content: 'City planners can now identify heat hotspots, optimize green space distribution, and design cooling strategies. Our dashboard makes this data accessible and actionable.',
    mapViewState: {
      longitude: 2.3522,
      latitude: 48.8566,
      zoom: 12
    },
    highlight: [
      'Heat hotspot identification',
      'Green space optimization',
      'Cooling strategy design'
    ]
  }
]

