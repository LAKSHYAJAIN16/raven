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
  const [render, setRender] = useState<boolean>(true);
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

  function megaReorderAndUpdate(
    pageY: number,
    index: number,
    text: string,
    id: string
  ) {
    //Text
    let nLines: Line[] = lines.map((x) => x);
    for (let i = 0; i < nLines.length; i++) {
      if (nLines[i].id !== id) {
        switch (nLines[i].type) {
          case LineType.h1 || LineType.h2 || LineType.h3:
            nLines[i].heading.text = document.getElementById(
              `T:${nLines[i].id}`
            )?.innerHTML;
          // console.log(nLines[i].heading?.text);
          default:
            break;
        }
      } else {
        switch (nLines[i].type) {
          case LineType.h1 || LineType.h2 || LineType.h3:
            nLines[i].heading.text = text;
          // console.log(nLines[i].heading?.text);
          default:
            break;
        }
      }
    }

    // go by ascending order and see if we can insert it
    let nLinePoses: LinePosition[] = posBuffers.map((x) => x);

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

  return (
    <>
      <div className="">
        {/* Actual Lines */}
        <div className="">
          {lines.map((e: Line, index: number) => (
            <>
              {render && (
                <>
                  {e.type === LineType.h1 && (
                    <RTHeading
                      e={e}
                      idx={index}
                      delFun={deleteItem}
                      posFun={registerPosition}
                      megaTextAndReorder={megaReorderAndUpdate}
                    />
                  )}
                  {e.type === LineType.h2 && (
                    <RTHeading
                      e={e}
                      idx={index}
                      delFun={deleteItem}
                      posFun={registerPosition}
                      megaTextAndReorder={megaReorderAndUpdate}
                    />
                  )}
                  {e.type === LineType.h3 && (
                    <RTHeading
                      e={e}
                      idx={index}
                      delFun={deleteItem}
                      posFun={registerPosition}
                      megaTextAndReorder={megaReorderAndUpdate}
                    />
                  )}
                  {e.type === LineType.paragraph && (
                    <RTPara
                      e={e}
                      idx={index}
                      delFun={deleteItem}
                      posFun={registerPosition}
                      megaTextAndReorder={megaReorderAndUpdate}
                    />
                  )}
                </>
              )}
            </>
          ))}
        </div>

        {/* Plus */}
        <div className="flex justify-center items-center flex-col z-10">
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

export const RTHeading: FC<RTElementProps> = ({
  e,
  delFun,
  posFun,
  idx,
  megaTextAndReorder,
}) => {
  const client = useRef<HTMLDivElement>(null);

  const onDrag = (event: DragEvent<HTMLImageElement>) => {
    // Get Text
    const text: string = document.getElementById(`T:${e.id}`).innerHTML;
    e.heading.text = text;
    // console.log(text);

    // Call for reorder
    megaTextAndReorder(event.pageY, idx, text, e.id);
  };

  const del = () => {
    delFun(e.id);
  };

  useEffect(() => {
    document.getElementById(`T:${e.id}`).innerHTML = e.heading.text;
    const offset: number = getOffset(document.getElementById(`L:${e.id}`)).top;
    console.log(`Number : ${idx} has rendered`);
    posFun(offset, e);
  }, [e.heading.text]);

  return (
    <>
      <div className="flex items-center mb-3" ref={client} id={`L:${e.id}`}>
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
            id={`T:${e.id}`}
          ></span>
        )}
        {e.type === LineType.h2 && (
          <span
            className="mt-0 text-2xl outline-none focus:outline-none rounded-2xl pl-3 pr-3 pt-1 pb-1 block resize-none sm:w-[90%] w-full overflow-hidden box"
            role="textbox"
            contentEditable="true"
            id={`T:${e.id}`}
          ></span>
        )}
        {e.type === LineType.h3 && (
          <span
            className="mt-0 text-lg outline-none focus:outline-none rounded-2xl pl-3 pr-3 pt-1 pb-1 block resize-none sm:w-[90%] w-full overflow-hidden box"
            role="textbox"
            contentEditable="true"
            id={`T:${e.id}`}
          ></span>
        )}
      </div>
    </>
  );
};

export const RTPara: FC<RTElementProps> = ({
  e,
  delFun,
  posFun,
  idx,
  megaTextAndReorder,
}) => {
  const [entities, setEntities] = useState<Entity[]>([]);
  const [renderMenu, setRenderMenu] = useState(false);
  const [isBold, setIsBold] = useState<boolean>(false);
  const [isItalic, setIsItalic] = useState<boolean>(false);

  const onDrag = (event: DragEvent<HTMLImageElement>) => {
    // Get Text
    const text: string = document.getElementById(`T:${e.id}`).innerHTML;
    // console.log(text);

    // Call for reorder
    megaTextAndReorder(event.pageY, idx, text, e.id);
  };

  const del = () => {
    delFun(e.id);
  };

  const boldFn = () => {
    console.log(getSelectedText());
    switch (isBold) {
      case false:
        setIsBold(true);
        break;
      case true:
        setIsBold(false);
        break;
    }
  };

  const italicFn = () => {
    switch (isItalic) {
      case false:
        setIsItalic(true);
        break;
      case true:
        setIsItalic(false);
        break;
    }
  };

  const send = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    let sEntities: Entity[] = entities.map((x) => x);
    let nEntities: Entity[] = checkForDeletes(sEntities, e.target.value);

    // IF THIS WAS A DELETE OPERATION, DO NOT ADD DELTA
    if (textWasShortened(entities, e.target.value) === true) {
      // console.log(nEntities);
      setEntities(nEntities);

      document.getElementById(
        "ENT:OUR_BOI"
      ).innerHTML = `${convertEntitiesToHTML(nEntities)}`;
      return;
    } else {
      // get deltas
      const deltas: EntityDelta[] = calculatePrevTextDelta(
        sEntities,
        e.target.value
      );

      for (let i = 0; i < deltas.length; i++) {
        const element = deltas[i];
        sEntities.splice(element.index, 0, {
          char: element.delta,
          isBold: isBold,
          isItalic: isItalic,
          id: randomString(10),
        });
      }

      //Get the
      document.getElementById(
        "ENT:OUR_BOI"
      ).innerHTML = `${convertEntitiesToHTML(sEntities)}`;

      setEntities(sEntities);
    }
  };

  function calculatePrevTextDelta(entities: Entity[], text: string) {
    // Create this kind of text object, where we compile our previous $#!7
    // LEGACY CODE
    // let mega_text: string = "";
    // for (let i = 0; i < entities.length; i++) {
    //   const entity = entities[i];
    //   mega_text += entity.char;
    // }
    // return text.replace(mega_text, "");
    let numericalDelta: number = Math.abs(textAndEntityDelta(entities, text));
    let delta: EntityDelta[] = [];
    for (let i = 0; i < text.length; i++) {
      const entity: Entity = entities[i];
      const t: string = text[i];
      // check if the text is undefined
      if (delta.length < numericalDelta) {
        if (entity === undefined) {
          delta.push({
            delta: t,
            index: i,
          });
        } else {
          if (t != entity.char) {
            delta.push({
              delta: t,
              index: i,
            });
            console.log(t);
          }
        }
      }
    }

    console.log(delta);

    return delta;
  }

  function textWasShortened(entities: Entity[], text: string) {
    // Create this kind of text object, where we compile our previous $#!7
    let mega_text: string = "";
    for (let i = 0; i < entities.length; i++) {
      const entity = entities[i];
      mega_text += entity.char;
    }
    if (mega_text.length > text.length) {
      // console.log("was shortened");
      return true;
    } else {
      return false;
    }
  }

  function textAndEntityDelta(entities: Entity[], text: string) {
    // Create this kind of text object, where we compile our previous $#!7
    let mega_text: string = "";
    for (let i = 0; i < entities.length; i++) {
      const entity = entities[i];
      mega_text += entity.char;
    }
    return mega_text.length - text.length;
  }

  function checkForDeletes(entities: Entity[], text: string) {
    // Assemble text by entities
    let returnEntities: Entity[] = [];
    const delta: number = textAndEntityDelta(entities, text);

    // find difference between our entity text and the actual text
    for (let i = 0; i < entities.length; i++) {
      const entity: string = entities[i].char;
      const letter: string = text[i];

      if (returnEntities.length < delta) {
        if (letter === undefined) {
          // Last letter was deleted, now deleting ${entity}
          returnEntities.push(entities[i]);
        } else {
          if (entity != letter) {
            // Program has found that ${entity} does not fulfil ${letter}
            returnEntities.push(entities[i]);
          }
        }
      }
    }

    console.log(returnEntities);
    // now, a bunch of random javascript magic
    const resultArray = entities.filter(
      (x) => !returnEntities.find((x2) => x.id === x2.id)
    );
    return resultArray;
  }

  function getSelectedText(){
      var text : string= "";
      var activeEl = document.activeElement;
      var activeElTagName = activeEl ? activeEl.tagName.toLowerCase() : null;
      if (
        (activeElTagName == "textarea") || (activeElTagName == "input" &&
        /^(?:text|search|password|tel|url)$/i.test(activeEl.type)) &&
        (typeof activeEl.selectionStart == "number")
      ) {
          text = activeEl.value.slice(activeEl.selectionStart, activeEl.selectionEnd);
      } else if (window.getSelection) {
          text = window.getSelection().toString();
      }
      return text;
  }

  function convertEntitiesToHTML(entities: Entity[]) {
    let output: string = "";
    // Loop through each entity
    for (let i = 0; i < entities.length; i++) {
      const element: Entity = entities[i];
      let prefix: string = `<span>`;
      let suffix: string = `</span>`;
      if (element.isBold) {
        prefix += "<b>";
        suffix += "</b>";
      }
      if (element.isItalic) {
        prefix += "<i>";
        suffix += "</i>";
      }
      output += `${prefix}${element.char}${suffix}`;
    }
    return output;
  }

  useEffect(() => {
    // document.getElementById(`T:${e.id}`).innerHTML = e.heading.text;
    const offset: number = getOffset(document.getElementById(`L:${e.id}`)).top;
    console.log(`Number : ${idx} has rendered`);
    posFun(offset, e);
  }, [e.para?.entities]);

  return (
    <div
      className="flex flex-col"
      onFocus={() => setRenderMenu(true)}
      // onBlur={() => setRenderMenu(false)}
    >
      {renderMenu && (
        <div className="flex justify-center">
          <Image
            alt="lol"
            src={`${isBold ? "/bold-i-button.png" : "/bold-button.png"}`}
            width={20}
            height={20}
            className={`cursor-pointer transition-all hover:scale-125 mr-1 ${
              isBold && "bg-black rounded-md"
            }`}
            onClick={() => boldFn()}
          />

          <Image
            alt="lol"
            src={`${isItalic ? "/italic-i-button.png" : "/italic-button.png"}`}
            width={20}
            height={20}
            className={`cursor-pointer transition-all hover:scale-125 mr-1 ${
              isItalic && "bg-black rounded-md"
            }`}
            onClick={() => italicFn()}
          />
        </div>
      )}

      <div className="flex items-center mb-3" id={`L:${e.id}`}>
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

        {/* Our Main Input */}
        <div className="flex w-full">
          <input
            className="mt-0 text-md outline-none focus:outline-none rounded-2xl pr-3 pt-1 pb-1 fixed z-0 resize-y sm:w-[50vw] w-[80%] overflow-hidden box break-words"
            id={`ENT:${e.id}:MAIN`}
            onChange={(e) => send(e)}
          ></input>
          <p id="ENT:OUR_BOI" className="mt-10 text-lg z-30"></p>
        </div>
      </div>
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
  megaTextAndReorder: Function;
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
  char: string;
  isBold: boolean;
  isItalic: boolean;
  id: string;
}

interface EntityDelta {
  index: number;
  delta: string;
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

enum HeadingType {
  h1,
  h2,
  h3,
}
