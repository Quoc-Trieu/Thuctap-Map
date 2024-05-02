export function msToTime(ms: any) {
  let seconds = ms / 1000;
  let minutes = Math.floor(seconds / 60);
  let hours = Math.floor(minutes / 60);

  minutes = minutes % 60;
  hours = hours % 24;

  minutes = Math.round(minutes * 10) / 10;

  let timeString = '';
  if (hours > 0) {
    timeString += hours + ' Giờ ';
  }
  if (minutes > 0) {
    timeString += minutes + ' Phút';
  }
  return timeString.trim();
}

export function secondsToTime(seconds: any) {
  let minutes = Math.floor(seconds / 60);
  let hours = Math.floor(minutes / 60);

  minutes = minutes % 60;
  hours = hours % 24;

  minutes = Math.round(minutes * 10) / 10;

  let timeString = '';
  if (hours > 0) {
    timeString += hours + ' Giờ ';
  }
  if (minutes > 0) {
    timeString += minutes + ' Phút';
  }
  return timeString.trim();
}

export function metersToKm(meters: any) {
  const km = meters / 1000;
  return Math.round(km * 10) / 10;
}

export function formatDistance(distance: number): string {
  let formattedDistance = Math.round(distance / 100) * 100;
  if (formattedDistance >= 1000) {
    formattedDistance /= 1000;
    return `${formattedDistance.toFixed(1)} km`;
  }
  return `${formattedDistance} m`;
}
