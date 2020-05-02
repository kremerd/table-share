export const fileListToArray = (files: FileList | null | undefined): File[] =>
  Array.from(files ?? []);

export const getEffectiveFilename = (filename: string): string => {
  const extStart = filename.lastIndexOf('.');
  if (extStart > 0) {
    return filename.slice(0, extStart);
  } else {
    return filename;
  }
};
