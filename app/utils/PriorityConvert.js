export default function convertPriority(p) {
  return p === 1 ? '♦' :
    p === 2 ? '♦♦' :
      p === 3 ? '♦♦♦' :
        p === 4 ? '♦♦♦♦' :
          p === 5 ? '♦♦♦♦♦' : '未指定';
}
