// app/tier-editor/page.tsx
"use client";

import React, { useState } from "react";
import {
  DndContext,
  DragOverlay,
  closestCenter,
  DragEndEvent,
  DragStartEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  arrayMove,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import Image from "next/image";
import { toPng } from "html-to-image";

const tiers = ["S", "A", "B", "C", "D"] as const;
const roles = ["EXP", "ROAM", "MID", "JG", "GOLD"] as const;
type Tier = typeof tiers[number];
type Role = typeof roles[number];
type PositionKey = `${Tier}-${Role}` | "clone-storage";

interface Character {
  id: string;
  name: string;
  img: string;
  isClone?: boolean;
}

const initialCharacters: { [K in Role]: Character[] } = {
  EXP: [
    { id: "exp-1", name: "lukas", img: "/images/lukas.png" },
    { id: "exp-2", name: "cici", img: "/images/cici.png" },
    { id: "exp-3", name: "arlott", img: "/images/arlott.png" },
    { id: "exp-4", name: "aulus", img: "/images/aulus.png" },
    { id: "exp-5", name: "phoveus", img: "/images/phoveus.png" },
    { id: "exp-6", name: "paquito", img: "/images/paquito.png" },
    { id: "exp-7", name: "gloo", img: "/images/gloo.png" },
    { id: "exp-8", name: "khaleed", img: "/images/khaleed.png" },
    { id: "exp-9", name: "benedetta", img: "/images/benedetta.png" },
    { id: "exp-10", name: "zhong", img: "/images/zhong.png" },
    { id: "exp-11", name: "silvanna", img: "/images/silvanna.png" },
    { id: "exp-12", name: "dyrroth", img: "/images/dyrroth.png" },
    { id: "exp-13", name: "xborg", img: "/images/xborg.png" },
    { id: "exp-14", name: "terizla", img: "/images/terizla.png" },
    { id: "exp-15", name: "esmeralda", img: "/images/esmeralda.png" },
    { id: "exp-16", name: "guinevere", img: "/images/guinevere.png" },
    { id: "exp-17", name: "badang", img: "/images/badang.png" },
    { id: "exp-18", name: "minsitthar", img: "/images/minsitthar.png" },
    { id: "exp-19", name: "thamuz", img: "/images/thamuz.png" },
    { id: "exp-20", name: "leomord", img: "/images/leomord.png" },
    { id: "exp-21", name: "aldous", img: "/images/aldous.png" },
    { id: "exp-22", name: "uranus", img: "/images/uranus.png" },
    { id: "exp-23", name: "martis", img: "/images/martis.png" },
    { id: "exp-24", name: "jawhead", img: "/images/jawhead.png" },
    { id: "exp-25", name: "argus", img: "/images/argus.png" },
    { id: "exp-26", name: "lapulapu", img: "/images/lapulapu.png" },
    { id: "exp-27", name: "hilda", img: "/images/hilda.png" },
    { id: "exp-28", name: "ruby", img: "/images/ruby.png" },
    { id: "exp-29", name: "alpha", img: "/images/alpha.png" },
    { id: "exp-30", name: "sun", img: "/images/sun.png" },
    { id: "exp-31", name: "chou", img: "/images/chou.png" },
    { id: "exp-32", name: "freya", img: "/images/freya.png" },
    { id: "exp-33", name: "zilong", img: "/images/zilong.png" },
    { id: "exp-34", name: "bane", img: "/images/bane.png" },
    { id: "exp-35", name: "balmond", img: "/images/balmond.png" },
    { id: "exp-36", name: "masha", img: "/images/masha.png" },

  ],
  ROAM: [
    { id: "roam-1", name: "kalea", img: "/images/kalea.png" },
    { id: "roam-2", name: "chip", img: "/images/chip.png" },
    { id: "roam-3", name: "floryn", img: "/images/floryn.png" },
    { id: "roam-4", name: "edith", img: "/images/edith.png" },
    { id: "roam-5", name: "mathilda", img: "/images/mathilda.png" },
    { id: "roam-6", name: "atlas", img: "/images/atlas.png" },
    { id: "roam-7", name: "carmilla", img: "/images/carmilla.png" },
    { id: "roam-8", name: "baxia", img: "/images/baxia.png" },
    { id: "roam-9", name: "khufra", img: "/images/khufra.png" },
    { id: "roam-10", name: "belerick", img: "/images/belerick.png" },
    { id: "roam-11", name: "kaja", img: "/images/kaja.png" },
    { id: "roam-12", name: "angela", img: "/images/angela.png" },
    { id: "roam-13", name: "hylos", img: "/images/hylos.png" },
    { id: "roam-14", name: "diggie", img: "/images/diggie.png" },
    { id: "roam-15", name: "grock", img: "/images/grock.png" },
    { id: "roam-16", name: "gatotkaca", img: "/images/gatotkaca.png" },
    { id: "roam-17", name: "estes", img: "/images/estes.png" },
    { id: "roam-18", name: "johnson", img: "/images/johnson.png" },
    { id: "roam-19", name: "lolita", img: "/images/lolita.png" },
    { id: "roam-20", name: "minotaur", img: "/images/minotaur.png" },
    { id: "roam-21", name: "rafaela", img: "/images/rafaela.png" },
    { id: "roam-22", name: "franco", img: "/images/franco.png" },
    { id: "roam-23", name: "akai", img: "/images/akai.png" },
    { id: "roam-24", name: "tigreal", img: "/images/tigreal.png" },
  ],
  MID: [
    { id: "mid-1", name: "zhuxin", img: "/images/zhuxin.png" },
    { id: "mid-2", name: "novaria", img: "/images/novaria.png" },
    { id: "mid-3", name: "xavier", img: "/images/xavier.png" },
    { id: "mid-4", name: "valentina", img: "/images/valentina.png" },
    { id: "mid-5", name: "yve", img: "/images/yve.png" },
    { id: "mid-6", name: "luoyi", img: "/images/luoyi.png" },
    { id: "mid-7", name: "cecilion", img: "/images/cecilion.png" },
    { id: "mid-8", name: "lylia", img: "/images/lylia.png" },
    { id: "mid-9", name: "kadita", img: "/images/kadita.png" },
    { id: "mid-10", name: "harith", img: "/images/harith.png" },
    { id: "mid-11", name: "lunox", img: "/images/lunox.png" },
    { id: "mid-12", name: "vale", img: "/images/vale.png" },
    { id: "mid-13", name: "selena", img: "/images/selena.png" },
    { id: "mid-14", name: "change", img: "/images/change.png" },
    { id: "mid-15", name: "valir", img: "/images/valir.png" },
    { id: "mid-16", name: "pharsa", img: "/images/pharsa.png" },
    { id: "mid-17", name: "odette", img: "/images/odette.png" },
    { id: "mid-18", name: "vexana", img: "/images/vexana.png" },
    { id: "mid-19", name: "aurora", img: "/images/aurora.png" },
    { id: "mid-20", name: "kagura", img: "/images/kagura.png" },
    { id: "mid-21", name: "gord", img: "/images/gord.png" },
    { id: "mid-22", name: "eudora", img: "/images/eudora.png" },
    { id: "mid-23", name: "nana", img: "/images/nana.png" },
    { id: "mid-24", name: "alice", img: "/images/alice.png" },
  ],
  JG: [
    { id: "jg-1", name: "suyou", img: "/images/suyou.png" },
    { id: "jg-2", name: "nolan", img: "/images/nolan.png" },
    { id: "jg-3", name: "joy", img: "/images/joy.png" },
    { id: "jg-4", name: "fredrinn", img: "/images/fredrinn.png" },
    { id: "jg-5", name: "julian", img: "/images/julian.png" },
    { id: "jg-6", name: "yin", img: "/images/yin.png" },
    { id: "jg-7", name: "aamon", img: "/images/aamon.png" },
    { id: "jg-8", name: "barats", img: "/images/barats.png" },
    { id: "jg-9", name: "ling", img: "/images/ling.png" },
    { id: "jg-10", name: "hanzo", img: "/images/hanzo.png" },
    { id: "jg-11", name: "gusion", img: "/images/gusion.png" },
    { id: "jg-12", name: "helcurt", img: "/images/helcurt.png" },
    { id: "jg-13", name: "lancelot", img: "/images/lancelot.png" },
    { id: "jg-14", name: "harley", img: "/images/harley.png" },
    { id: "jg-15", name: "roger", img: "/images/roger.png" },
    { id: "jg-16", name: "yisunshin", img: "/images/yisunshin.png" },
    { id: "jg-17", name: "natalia", img: "/images/natalia.png" },
    { id: "jg-18", name: "hayabusa", img: "/images/hayabusa.png" },
    { id: "jg-19", name: "fanny", img: "/images/fanny.png" },
    { id: "jg-20", name: "karina", img: "/images/karina.png" },
    { id: "jg-21", name: "alucard", img: "/images/alucard.png" },
    { id: "jg-22", name: "saber", img: "/images/saber.png" },
  ],
  GOLD: [
    { id: "gold-1", name: "ixia", img: "/images/ixia.png" },
    { id: "gold-2", name: "melissa", img: "/images/melissa.png" },
    { id: "gold-3", name: "natan", img: "/images/natan.png" },
    { id: "gold-4", name: "beatrix", img: "/images/beatrix.png" },
    { id: "gold-5", name: "brody", img: "/images/brody.png" },
    { id: "gold-6", name: "popol", img: "/images/popol.png" },
    { id: "gold-7", name: "wanwan", img: "/images/wanwan.png" },
    { id: "gold-8", name: "granger", img: "/images/granger.png" },
    { id: "gold-9", name: "kimmy", img: "/images/kimmy.png" },
    { id: "gold-10", name: "claude", img: "/images/claude.png" },
    { id: "gold-11", name: "hanabi", img: "/images/hanabi.png" },
    { id: "gold-12", name: "lesley", img: "/images/lesley.png" },
    { id: "gold-13", name: "irithel", img: "/images/irithel.png" },
    { id: "gold-14", name: "karrie", img: "/images/karrie.png" },
    { id: "gold-15", name: "moskov", img: "/images/moskov.png" },
    { id: "gold-16", name: "layla", img: "/images/layla.png" },
    { id: "gold-17", name: "clint", img: "/images/clint.png" },
    { id: "gold-18", name: "bruno", img: "/images/bruno.png" },
    { id: "gold-19", name: "miya", img: "/images/miya.png" },
  ],
};

const createInitialTierList = (): Record<PositionKey, Character[]> => {
  const list = {} as Record<PositionKey, Character[]>;
  for (const role of roles) {
    for (const tier of tiers) {
      const key = `${tier}-${role}` as PositionKey;
      list[key] = tier === "D" ? [...initialCharacters[role]] : [];
    }
  }
  return list;
};

export default function TierEditorPage() {
  const [tierList, setTierList] = useState<Record<PositionKey, Character[]>>(createInitialTierList);
  const [activeChar, setActiveChar] = useState<Character | null>(null);
  const [activeFromKey, setActiveFromKey] = useState<PositionKey | null>(null);
  const [, setImageUrl] = useState<string | null>(null);
  const [clonedCharacters, setClonedCharacters] = useState<Character[]>([]);
  const generateUniqueId = () => `clone-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

  const handleCloneDrop = (char: Character) => {
    const newChar: Character = {
      ...char,
      id: generateUniqueId(),
      isClone: true,
    };
    setClonedCharacters((prev) => [...prev, newChar]);
  };

  const handleDragStart = (event: DragStartEvent) => {
    const from = event.active.data.current?.from as PositionKey;
    const char = event.active.data.current?.char as Character;
    setActiveFromKey(from);
    setActiveChar(char);

    if (from === "clone-storage") {
      setClonedCharacters((prev) => prev.filter((c) => c.id !== char.id));
    }
  };

  const handleDragEnd = ({ over }: DragEndEvent) => {
    if (!over || !activeChar || !activeFromKey) {
      setActiveChar(null);
      return;
    }

    const toKey = (over.data.current?.from ?? over.id) as PositionKey;
    if (!toKey) {
      setActiveChar(null);
      return;
    }

    if (over.id === "clone-area") {
      handleCloneDrop(activeChar);
      setActiveChar(null);
      return;
    }

    if (over.id === "delete-area") {
      if (activeFromKey === "clone-storage") {
        // 複製キャラだった場合
        setClonedCharacters((prev) => prev.filter((c) => c.id !== activeChar.id));
      } else {
        // Tier表内のキャラだった場合
        const newList = { ...tierList };
        newList[activeFromKey] = newList[activeFromKey].filter((c) => c.id !== activeChar.id);
        setTierList(newList);
      }
    
      setActiveChar(null);
      return;
    }

    if (activeFromKey === toKey) {
      const oldIndex = tierList[toKey].findIndex((c) => c.id === activeChar.id);
      const newIndex = tierList[toKey].findIndex((c) => c.id === over.id);
      if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
        const updated = arrayMove(tierList[toKey], oldIndex, newIndex);
        setTierList({ ...tierList, [toKey]: updated });
      }
    } else {
      
      const overId = over.id;
      const overIndex = tierList[toKey].findIndex((c) => c.id === overId);
      const insertIndex = overIndex !== -1 ? overIndex : tierList[toKey].length;

      const newList = { ...tierList };

      // 👇 clone-storageから来たときは削除処理をスキップ！
      if (activeFromKey !== "clone-storage") {
        newList[activeFromKey] = newList[activeFromKey].filter((c) => c.id !== activeChar.id);
      }

      newList[toKey] = [
        ...newList[toKey].slice(0, insertIndex),
        activeChar,
        ...newList[toKey].slice(insertIndex),
      ];

      setTierList(newList);

    }

    setActiveChar(null);
  };

  const handleSaveImage = async () => {
    const target = document.getElementById("tier-table");
    if (!target) return;
  
    try {
      const dataUrl = await toPng(target, { cacheBust: true });
      setImageUrl(dataUrl);
  
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = "tier-list.png";
      link.click();
    } catch (error) {
      console.error("画像生成に失敗しました", error);
    }
  };

  function CloneTargetArea() {
    const { setNodeRef, isOver } = useDroppable({ id: "clone-area" });
  
    return (
      <div
        ref={setNodeRef}
        className="flex items-center gap-2 p-2 border rounded border-none bg-[#222]"
        style={{ minHeight: 60 }}
      >
        <Image src="/images/plus.png" alt="複製" width={70} height={70} />
        <div className="flex flex-wrap gap-2">
          {clonedCharacters.map((char) => (
            <SortableCharacter key={char.id} char={char} from="clone-storage" />
          ))}
        </div>
      </div>
    );
  }

  function DeleteTargetArea() {
    const { setNodeRef, isOver } = useDroppable({ id: "delete-area" });
  
    return (
      <div
        ref={setNodeRef}
        className={`flex items-center justify-center w-[64px] h-[64px] border rounded ${
          isOver ? "bg-red-700" : "bg-[#333]"
        }`}
        style={{ transition: "0.2s" }}
      >
        <Image src="/images/delete.png" alt="削除" width={70} height={70} />
      </div>
    );
  }

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
            <div className="w-[300px] h-[80px] relative">
                <Image
                src="/images/title.png"
                alt="TIER表"
                fill
                className="object-contain"
                />
            </div>
            <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={handleSaveImage}>画像保存</button>
            <span className="text-white text-sm whitespace-nowrap">
              複製したいキャラをドラッグ&ドロップしてね→
            </span>
            <CloneTargetArea />
            <DeleteTargetArea />
        </div>

        <div id="tier-table" className="overflow-auto p-4 border rounded bg-black shadow-lg">
          <table className="border-collapse border border-gray-300 mx-auto">
            <thead>
              <tr>
                <th className="border border-gray-300 w-16"></th>
                {roles.map((role) => (
                  <th key={role} className="border border-gray-300 p-1 text-center bg-black">
                    <div className="w-12 h-12 rounded overflow-hidden mx-auto">
                        <Image
                            src={`/roles/${role}.png`}
                            alt={role}
                            width={48}
                            height={48}
                            objectFit="cover"
                            objectPosition="center"
                        />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tiers.map((tier) => (
                <tr key={tier}>
                    <td className="border border-gray-300 bg-black text-center p-1">
                        <div className="w-12 h-12 rounded overflow-hidden mx-auto">
                        <Image
                            src={`/tiers/${tier}.png`} // 例: /tiers/S.png, /tiers/A.png など
                            alt={tier}
                            width={48}
                            height={48}
                            objectFit="cover"
                            objectPosition="center"
                        />
                        </div>
                    </td>
                    {roles.map((role) => {
                      const key = `${tier}-${role}` as PositionKey;
                      return (
                        <DroppableCell
                          key={key}
                          id={key}
                          characters={tierList[key] || []}
                          activeCharId={activeChar?.id ?? null}
                        />
                      );
                    })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <DragOverlay>
        {activeChar ? (
          <Image
            src={activeChar.img}
            alt={activeChar.name}
            width={48}
            height={48}
            className="rounded-full"
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

function DroppableCell({
  id,
  characters,
  activeCharId,
}: {
  id: string;
  characters: Character[];
  activeCharId: string | null;
}) {
  const { setNodeRef } = useDroppable({ id });

  const visible = characters.filter((c) => c.id !== activeCharId);

  return (
    <td
      ref={setNodeRef}
      className="border border-gray-300 p-2 align-top"
      style={{ backgroundColor: "#0F2546",width: 240 }} // 4体 * (48px + gap)
    >
      <SortableContext items={characters.map((c) => c.id)} strategy={rectSortingStrategy}>
        <div className="flex flex-wrap gap-2">
          {visible.map((char) => (
            <SortableCharacter key={char.id} char={char} from={id as PositionKey} />
          ))}
        </div>
      </SortableContext>
    </td>
  );
}

function SortableCharacter({
  char,
  from,
}: {
  char: Character;
  from: PositionKey;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: char.id, data: { from, char } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Image
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      src={char.img}
      alt={char.name}
      width={48}
      height={48}
      style={style}
      className="rounded-full border cursor-move"
    />
  );
}
