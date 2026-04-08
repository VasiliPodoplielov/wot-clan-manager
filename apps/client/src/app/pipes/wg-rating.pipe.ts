import { Pipe, PipeTransform } from '@angular/core';

/**
 * WGR tier background colors (v2 2020-Jan-29 reference table).
 * Maps Wargaming player rating (WGR) to background hex for tags/UI.
 */
export const WG_RATING_BACKGROUND_BY_WGR: ReadonlyArray<{
  readonly min: number;
  readonly color: string;
}> = [
  { min: Number.NEGATIVE_INFINITY, color: '#000000' }, // Very Bad — below 2000
  { min: 2000, color: '#BA3232' }, // Bad
  { min: 3500, color: '#D07000' }, // Below Average
  { min: 4250, color: '#D0B000' }, // Average
  { min: 6000, color: '#608030' }, // Good
  { min: 7000, color: '#407030' }, // Very Good
  { min: 8000, color: '#4080A0' }, // Great
  { min: 9000, color: '#8050A0' }, // Unicum
  { min: 10000, color: '#503070' }, // Super Unicum — above 10000
];

export function getWgRatingBackgroundColor(rating: number | null | undefined): string {
  if (rating == null || Number.isNaN(rating)) {
    return '#000000';
  }
  let color = WG_RATING_BACKGROUND_BY_WGR[0].color;

  for (const tier of WG_RATING_BACKGROUND_BY_WGR) {
    if (rating >= tier.min) {
      color = tier.color;
    }
  }
  return color;
}

@Pipe({
  name: 'wgRatingColor',
  standalone: true,
})
export class WgRatingColorPipe implements PipeTransform {
  transform(value: number | null | undefined): string {
    return getWgRatingBackgroundColor(value);
  }
}
