export const removeById = <T extends { id: number | string }> (array: T[], id: T['id']): T[] => {
  const index = array.findIndex(item => item.id === id);
  return removeByIndex(array, index);
}

export const removeByIndex = <T> (array: T[], index: number): T[] => {
  return [
    ...array.slice(0, index),
    ...array.slice(index + 1)
  ];
}

export const updateById = <T extends { id: number | string }> (array: T[], replacement: T, id: T['id'] = replacement.id): T[] => {
  const index = array.findIndex(item => item.id === id);
  return updateByIndex(array, replacement, index);
}

export const updateByIndex = <T> (array: T[], replacement: T, index: number): T[] => {
  return [
    ...array.slice(0, index),
    replacement,
    ...array.slice(index + 1)
  ];
}
