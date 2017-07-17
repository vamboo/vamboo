interface Program {
  // TODO: histories: [Operation];
  blocks: [Block];
  inputs: [Input];
  outputs: [Output];
}

type BlockClassID = number;
type BlockInstanceID = number;  // こういうときに構造的部分型はダメなんだよ...
type InputInstanceID = number;
type OutputInstanceID = number;

interface Block {
  // ブロックの名前や実装に関する情報はプログラムを表すファイルではないどこか別の場所にある。
  // 最終的にはコンポーネントストアを参照するようにしたいが、
  // とりあえずはランタイム/エディタの実装にハードコートしてしまっていいと思う。
  id: BlockInstanceID;
  classId: BlockClassID;
  coordinate: {
    x: number;
    y: number;
  };
  attributes: object;  // 各ブロックの実装が使う
}

interface Input {
  id: InputInstanceID;
  block: BlockInstanceID;
  name: string;
}

interface Output {
  id: OutputInstanceID;
  block: BlockInstanceID;
  inputs: [InputInstanceID];
  name: string;
}
