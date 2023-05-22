import React, { FC, useRef, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { EditorProps } from "react-draft-wysiwyg";
import randomString from "../lib/randomString";

const Editor = dynamic<EditorProps>(
  () => import("react-draft-wysiwyg").then((mod) => mod.Editor),
  { ssr: false }
);

export const RTEditor: FC = () => {
  const [expandPlus, setExpandPlus] = useState<boolean>(false);
  const [lines, setLines] = useState<Line[]>([]);
  const [posBuffers, setPosBuffers] = useState<LinePosition[]>([]);

  function createLine(type: LineType) {
    setExpandPlus(false);

    //Add a new Line
    let nLines = lines.map((x) => x);
    let line: Line = {
      type: type,
      id: randomString(10),
    };

    switch (type) {
      case LineType.h1:
        const heading: Heading = {
          type: HeadingType.h1,
          text: "",
        };
        line.heading = heading;
        break;

      case LineType.h2:
        const heading2: Heading = {
          type: HeadingType.h2,
          text: "",
        };
        line.heading = heading2;
        break;

      case LineType.h3:
        const heading3: Heading = {
          type: HeadingType.h3,
          text: "",
        };
        line.heading = heading3;
        break;

      case LineType.paragraph:
        const para: Paragraph = {
          entities: [],
        };
        line.para = para;
        break;

      case LineType.image:
        const image: Picture = {
          url: "",
          finalURL: "",
        };
        line.image = image;
        break;

      case LineType.blockquote:
        const blockquote: Blockquote = {
          text: "",
        };
        line.blockQuote = blockquote;
        break;

      case LineType.url:
        const url: Url = {
          url: "",
        };
        line.url = url;
        break;
    }

    nLines.push(line);
    setLines(nLines);
  }

  function deleteItem(id: string) {
    //Duplicate and remove
    let nLines: Line[] = lines.map((x) => x);
    let act_lines: Line[] = [];
    for (let i = 0; i < nLines.length; i++) {
      const line = nLines[i];
      if (line.id !== id) {
        act_lines.push(line);
      }
    }

    //Remove from positions as well
    let nLinePositions: LinePosition[] = posBuffers.map((x) => x);
    let act_line_positions: LinePosition[] = [];
    for (let i = 0; i < nLinePositions.length; i++) {
      const linePos = nLinePositions[i];
      if (linePos.line.id !== id) {
        act_line_positions.push(linePos);
      }
    }
    console.log(act_line_positions);
    setLines(act_lines);
    setPosBuffers(act_line_positions);
  }

  function registerPosition(pos: number, line: Line) {
    // check if we already have that posBuffer
    let nLines: LinePosition[] = posBuffers.map((x) => x);
    let found: boolean = false;
    for (let i = 0; i < nLines.length; i++) {
      const linePos: LinePosition = nLines[i];
      if (linePos.line.id === line.id) {
        // Update position
        nLines[i].position = pos;
        found = true;
        break;
      }
    }

    if (found === false) {
      nLines.push({
        line: line,
        position: pos,
      });
    }

    console.log(nLines);
    setPosBuffers(nLines);
  }

  function reorderLines(pageY: number, line: Line, index: number) {
    // go by ascending order and see if we can insert it
    let nLinePoses: LinePosition[] = posBuffers.map((x) => x);
    let nLines: Line[] = lines.map((x) => x);

    for (let i = nLinePoses.length - 1; i > -1; i--) {
      const pos: number = nLinePoses[i].position;
      if (pos <= pageY) {
        console.log(i + 1);

        // Swap dem boiz
        const toSwap: Line = nLines[i];
        const swapper: Line = nLines[index];
        nLines[i] = swapper;
        nLines[index] = toSwap;
        break;
      }
    }

    setLines(nLines);
  }

  function updateTextItem(text: string, id: string) {
    //Duplicate and remove
    let nLines: Line[] = lines.map((x) => x);
    let act_lines: Line[] = [];
    for (let i = 0; i < nLines.length; i++) {
      const line = nLines[i];
      if (line.id === id) {
        switch (act_lines[i].type) {
          case LineType.h1 || LineType.h2 || LineType.h3:
            act_lines[i].heading.text = text;
          default:
            break;
        }
      }
    }
  }

  return (
    <>
      <div className="">
        {/* Actual Lines */}
        <div className="">
          {lines.map((e: Line, index: number) => (
            <RTElement
              e={e}
              idx={index}
              delFun={deleteItem}
              posFun={registerPosition}
              reorderFun={reorderLines}
            />
          ))}
        </div>

        {/* Plus */}
        <div className="flex justify-center items-center flex-col">
          <Image
            onClick={() => setExpandPlus(!expandPlus)}
            src="/pluss.png"
            className="hover:scale-125 transition-all  cursor-pointer"
            width={20}
            height={20}
            alt="nan"
          />
          {expandPlus && (
            <div className="flex mt-3">
              <Image
                src="/heading.png"
                width={30}
                height={30}
                alt="lol"
                className="mr-1 cursor-pointer  animate-fade-in"
                style={{ animationDelay: "0.1s !important" }}
                onClick={() => createLine(LineType.h1)}
              />
              <Image
                src="/h2.png"
                width={30}
                height={30}
                alt="lol"
                className="mr-1 cursor-pointer  animate-fade-in"
                style={{ animationDelay: "0.2s !important " }}
                onClick={() => createLine(LineType.h2)}
              />
              <Image
                src="/h3.png"
                width={30}
                height={30}
                alt="lol"
                className="mr-1 cursor-pointer  animate-fade-in"
                style={{ animationDelay: "0.3s !important" }}
                onClick={() => createLine(LineType.h3)}
              />
              <Image
                src="/p.png"
                width={30}
                height={30}
                alt="lol"
                className="mr-1 cursor-pointer  animate-fade-in scale-90"
                style={{ animationDelay: "0.3s !important" }}
                onClick={() => createLine(LineType.paragraph)}
              />
              <Image
                src="/insert-picture-icon.png"
                height={30}
                width={30}
                alt="lol"
                className="mr-1 cursor-pointer scale-90 animate-fade-in"
                style={{ animationDelay: "0.4s !important" }}
                onClick={() => createLine(LineType.image)}
              />
              <Image
                src="/url.png"
                width={30}
                height={30}
                alt="lol"
                className="mr-1 cursor-pointer scale-90  animate-fade-in"
                style={{ animationDelay: "0.5s !important" }}
                onClick={() => createLine(LineType.url)}
              />
              <Image
                src="/left-quote.png"
                width={30}
                height={30}
                alt="lol"
                className="mr-1 cursor-pointer scale-90  animate-fade-in"
                style={{ animationDelay: "0.6s !important" }}
                onClick={() => createLine(LineType.blockquote)}
              />
            </div>
          )}
        </div>
      </div>

      <br />
    </>
  );
};

export const RTElement: FC<RTElementProps> = ({
  e,
  delFun,
  posFun,
  reorderFun,
  idx,
}) => {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const client = useRef<HTMLDivElement>(null);

  const onDrag = (event: DragEvent<HTMLImageElement>) => {
    // Get Delta
    reorderFun(event.pageY, e, idx);
  };

  const del = () => {
    delFun(e.id);
  };

  const updateHead = () => {
    console.log(document.getElementById("text"));
    const text: string = document.getElementById("text").innerHTML;
    console.log(text);
  };

  useEffect(() => {
    const offset: number = getOffset(document.getElementById(`L:${e.id}`)).top;
    console.log(`Number : ${idx} has rendered`);
    posFun(offset, e);
  }, []);

  return (
    <div
      className="flex items-center mb-3"
      ref={client}
      id={`L:${e.id}`}
      onKeyDown={(e) => updateHead()}
    >
      <Image
        alt="lol"
        src="/drag.png"
        width={15}
        height={15}
        className="cursor-move transition-all hover:scale-125 mr-3"
        onDragEnd={(e) => onDrag(e)}
      />
      <Image
        alt="lol"
        src="/delete.png"
        width={15}
        height={15}
        onClick={() => del()}
        className="cursor-pointer transition-all hover:scale-125 mr-3"
      />

      {/* Type Wise */}
      {e.type === LineType.h1 && (
        <span
          className="mt-0 text-4xl font-extrabold outline-none focus:outline-none rounded-2xl pl-3 pr-3 pt-1 pb-1 block resize-none sm:w-[90%] w-full overflow-hidden box"
          role="textbox"
          contentEditable="true"
          id="text"
        ></span>
      )}
      {e.type === LineType.h2 && (
        <span
          className="mt-0 text-2xl outline-none focus:outline-none rounded-2xl pl-3 pr-3 pt-1 pb-1 block resize-none sm:w-[90%] w-full overflow-hidden box"
          role="textbox"
          contentEditable="true"
          id="text"
        ></span>
      )}
      {e.type === LineType.h3 && (
        <span
          className="mt-0 text-lg outline-none focus:outline-none rounded-2xl pl-3 pr-3 pt-1 pb-1 block resize-none sm:w-[90%] w-full overflow-hidden box"
          role="textbox"
          contentEditable="true"
          id="text"
        ></span>
      )}
    </div>
  );
};

export function getOffset(el: any) {
  var _x = 0;
  var _y = 0;
  while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
    _x += el.offsetLeft - el.scrollLeft;
    _y += el.offsetTop - el.scrollTop;
    el = el.offsetParent;
  }
  return { top: _y, left: _x };
}

interface RTElementProps {
  e: Line;
  delFun: Function;
  posFun: Function;
  reorderFun: Function;
  idx: number;
}

interface Line {
  type: LineType;
  id: string;
  para?: Paragraph;
  heading?: Heading;
  image?: Picture;
  url?: Url;
  blockQuote?: Blockquote;
}

interface LinePosition {
  line: Line;
  position: number;
}

interface Paragraph {
  entities: Entity[];
}

interface Blockquote {
  text: string;
}

interface Heading {
  text: string;
  type: HeadingType;
}

interface Entity {
  text: string;
  type: EntityType;
}

interface Picture {
  url: string;
  finalURL?: string;
}

interface Url {
  url: string;
}

enum LineType {
  h1,
  h2,
  h3,
  paragraph,
  image,
  url,
  blockquote,
}

enum EntityType {
  regular,
  bold,
  italic,
  underline,
  strikethrough,
}

enum HeadingType {
  h1,
  h2,
  h3,
}
