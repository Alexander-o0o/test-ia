/* eslint-disable import/prefer-default-export */
export function secToTimestr(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds - hours * 3600) / 60);
  const seconds = Math.floor(totalSeconds - hours * 3600 - minutes * 60);
  return (
    `${totalSeconds > 3600 ? `${hours}:` : ''}`
      + `${`0${minutes}`.slice(-2)}:${`0${seconds}`.slice(-2)}`);
}

export function saveWithBlob(url, filename) {
  const xhr = new XMLHttpRequest();
  xhr.responseType = 'blob';
  xhr.onload = () => {
    const blobUrl = URL.createObjectURL(xhr.response);

    const a = document.createElement('a');
    a.setAttribute('href', blobUrl);
    a.setAttribute('download', filename);
    a.style.setProperty('display', 'none');

    document.body.append(a);
    a.click();
    a.remove();

    URL.revokeObjectURL(blobUrl);
  };

  xhr.open('GET', url);
  xhr.send();
}
