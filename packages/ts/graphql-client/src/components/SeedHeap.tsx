// Highlight colors for vowels, consonants, and both
const VOWEL_HIGHLIGHT_COLOR = "#8b5cf6";
const CONSONANT_HIGHLIGHT_COLOR = "#34d399";
const FINAL_HIGHLIGHT_COLOR = "#60a5fa";
const BOTH_HIGHLIGHT_COLOR = "#f59e0b";
const THREE_HIGHLIGHT_COLOR = "#fb923c";

import * as d3 from "d3";

import { useEffect, useRef, useState } from "react";

import { match } from "ts-pattern";
import { useOutputScript } from "../context/OutputScriptContext";
import { useTranslation } from "../i18n";

interface Bija {
  id: string;
  iast: string;
  devanagari: string;
  initialcluster: string;
  vowel: string;
  final: string;
}

// const CUTOFF_SMALL = 100;
const CUTOFF_MIDDLE = 1000;
const CUTOFF_LARGE = 3000;

type HeapSize = "small" | "middle" | "large";

function getTooltipHtml(d: Bija, scriptMode: string, t: any) {
  return `
    <div>
      <div class='text-2xl'><strong>${
        scriptMode === "iast" ? d.iast : d.devanagari
      }</strong></div><br/>
      ${t("initial")}: ${d.initialcluster || "-"}<br/>
      ${t("vowel")}: ${d.vowel}<br/>
      ${t("final")}: ${d.final || "-"}<br/>
    </div>
  `;
}

export const SeedHeap = ({
  data,
  highlightVowel,
  highlightConsonant,
  highlightFinal,
}: {
  data: Bija[];
  highlightVowel?: string | null;
  highlightConsonant?: string | null;
  highlightFinal?: string | null;
}) => {
  const { t } = useTranslation();
  const { mode: scriptMode } = useOutputScript();
  const svgRef = useRef<SVGSVGElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const [heapSize, setHeapSize] = useState<HeapSize>("small");

  useEffect(() => {
    const getHeapSize = (): HeapSize => {
      if (data.length >= CUTOFF_LARGE) return "small";
      if (data.length >= CUTOFF_MIDDLE) return "middle";
      return "large";
    };
    const newHeapSize = getHeapSize();
    if (newHeapSize !== heapSize) {
      setHeapSize(newHeapSize);
    }
  }, [data]);

  const getRadiusForSize = (size: HeapSize): number =>
    match(size)
      .with("small", () => 4)
      .with("middle", () => 16)
      .with("large", () => 20)
      .otherwise(() => 0);

  const getPaddingForSize = (size: HeapSize): number =>
    match(size)
      .with("small", () => 4)
      .with("middle", () => 6)
      .with("large", () => 6)
      .otherwise(() => 0);

  const getFontSizeForSize = (size: HeapSize): string =>
    match(size)
      .with("small", () => "10px")
      .with("middle", () => "14px")
      .with("large", () => "20px")
      .otherwise(() => "0px");

  useEffect(() => {
    // Create tooltip div if not exists
    if (!tooltipRef.current) {
      const div = d3
        .select("body")
        .append("div")
        .attr("class", "seedheap-tooltip")
        .style("position", "absolute")
        .style("visibility", "hidden")
        .style("background", "white")
        .style("border", "1px solid #ccc")
        .style("padding", "8px")
        .style("border-radius", "4px")
        .style("box-shadow", "0px 0px 6px rgba(0,0,0,0.1)")
        .style("pointer-events", "none")
        .style("opacity", 0);
      tooltipRef.current = div.node();
    }
  }, []);

  useEffect(() => {
    if (!svgRef.current || data.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = svgRef.current.clientWidth;
    svg.attr("width", width);

    const radius = getRadiusForSize(heapSize);
    const padding = getPaddingForSize(heapSize);
    const cols = Math.floor(width / (radius * 2 + padding));
    const rows = Math.ceil(data.length / cols);
    const totalHeight = padding + rows * (radius * 2 + padding);
    svg.attr("height", totalHeight);

    const tooltip = d3.select(tooltipRef.current!);

    const fillColor = (d: Bija) => {
      const isVowel = highlightVowel && d.vowel === highlightVowel;
      const isConsonant =
        highlightConsonant && d.initialcluster.includes(highlightConsonant);
      const isFinal = highlightFinal && d.final === highlightFinal;
      if (isVowel && isConsonant && isFinal) return THREE_HIGHLIGHT_COLOR;
      if (
        (isVowel && isConsonant) ||
        (isVowel && isFinal) ||
        (isConsonant && isFinal)
      )
        return BOTH_HIGHLIGHT_COLOR;
      if (isVowel) return VOWEL_HIGHLIGHT_COLOR;
      if (isConsonant) return CONSONANT_HIGHLIGHT_COLOR;
      if (isFinal) return FINAL_HIGHLIGHT_COLOR;
      return "#ddd";
    };

    const onCircleHover = function (this: any, event: any, d: Bija) {
      // For demonstration, incoming and outgoing are empty arrays since data does not contain sourceId/targetId
      // Adjust as needed if you have link data

      // Align tooltip to the position of the hovered SVG element (circle) rather than the mouse position
      const cx = d3.select(this).attr("cx");
      const cy = d3.select(this).attr("cy");
      // add cursor to pointer
      d3.select(this).style("cursor", "pointer");

      const matrix = (this as SVGGraphicsElement).getScreenCTM();
      if (matrix) {
        const point = svgRef.current!.createSVGPoint();
        point.x = +cx;
        point.y = +cy;
        const transformed = point.matrixTransform(matrix);
        tooltip
          .html(getTooltipHtml(d, scriptMode, t))
          .style("top", `${transformed.y + 10}px`)
          .style("left", `${transformed.x + 10}px`)
          .style("visibility", "visible")
          .transition()
          .duration(120)
          .style("opacity", 1);
      }
      // Stop propagation to prevent document mouseover from hiding immediately
      event.stopPropagation();
    };

    match(heapSize)
      .with("small", () => {
        svg
          .selectAll("circle")
          .data(data)
          .enter()
          .append("circle")
          .attr("r", 4)
          .attr("fill", fillColor)
          .attr("stroke", "#888")
          .style("pointer-events", "all")
          .style("user-select", "none")
          .attr("cx", (_, i) => {
            const col = i % cols;
            return padding + radius + col * (radius * 2 + padding);
          })
          .attr("cy", (_, i) => {
            const row = Math.floor(i / cols);
            return padding + radius + row * (radius * 2 + padding);
          })
          .on("mouseover", onCircleHover)
          .on("mouseenter", function () {
            d3.select(this).attr("stroke-width", 3).attr("stroke", "#333");
          })
          .on("mouseleave", function () {
            d3.select(this).attr("stroke-width", 1).attr("stroke", "#888");
          });
      })
      .with("middle", () => {
        svg
          .selectAll("circle")
          .data(data)
          .enter()
          .append("circle")
          .attr("r", radius)
          .attr("fill", fillColor)
          .attr("stroke", "#888")
          .attr("stroke-width", 2)
          .attr("filter", "url(#drop-shadow)")
          .style("pointer-events", "all")
          .style("user-select", "none")
          .attr("cx", (_, i) => {
            const col = i % cols;
            return padding + radius + col * (radius * 2 + padding);
          })
          .attr("cy", (_, i) => {
            const row = Math.floor(i / cols);
            return padding + radius + row * (radius * 2 + padding);
          })
          .on("mouseover", onCircleHover)
          .on("mouseenter", function () {
            d3.select(this).attr("stroke-width", 3).attr("stroke", "#333");
          })
          .on("mouseleave", function () {
            d3.select(this).attr("stroke-width", 1).attr("stroke", "#888");
          });

        // Add drop shadow filter definition
        svg
          .append("defs")
          .append("filter")
          .attr("id", "drop-shadow")
          .attr("height", "130%")
          .append("feDropShadow")
          .attr("dx", 2)
          .attr("dy", 2)
          .attr("stdDeviation", 2)
          .attr("flood-color", "#888")
          .attr("flood-opacity", 0.5);

        svg
          .selectAll("text")
          .data(data)
          .enter()
          .append("text")
          .attr("x", (_, i) => {
            const col = i % cols;
            return padding + radius + col * (radius * 2 + padding);
          })
          .attr("y", (_, i) => {
            const row = Math.floor(i / cols);
            return padding + radius + row * (radius * 2 + padding) + 5;
          })
          .attr("text-anchor", "middle")
          .attr("font-size", getFontSizeForSize(heapSize))
          .attr("fill", "#000")
          .text((d) => (scriptMode === "iast" ? d.iast : d.devanagari));
      })
      .with("large", () => {
        svg
          .selectAll("circle")
          .data(data)
          .enter()
          .append("circle")
          .attr("r", radius)
          .attr("fill", fillColor)
          .attr("stroke", "#888")
          .attr("stroke-width", 2)
          .attr("filter", "url(#drop-shadow)")
          .style("pointer-events", "all")
          .style("user-select", "none")
          .attr("cx", (_, i) => {
            const col = i % cols;
            return padding + radius + col * (radius * 2 + padding);
          })
          .attr("cy", (_, i) => {
            const row = Math.floor(i / cols);
            return padding + radius + row * (radius * 2 + padding);
          })
          .on("mouseover", onCircleHover)
          .on("mouseenter", function () {
            d3.select(this).attr("stroke-width", 3).attr("stroke", "#333");
          })
          .on("mouseleave", function () {
            d3.select(this).attr("stroke-width", 1).attr("stroke", "#888");
          });

        // Add drop shadow filter definition
        svg
          .append("defs")
          .append("filter")
          .attr("id", "drop-shadow")
          .attr("height", "130%")
          .append("feDropShadow")
          .attr("dx", 2)
          .attr("dy", 2)
          .attr("stdDeviation", 2)
          .attr("flood-color", "#888")
          .attr("flood-opacity", 0.5);

        svg
          .selectAll("text")
          .data(data)
          .enter()
          .append("text")
          .attr("x", (_, i) => {
            const col = i % cols;
            return padding + radius + col * (radius * 2 + padding);
          })
          .attr("y", (_, i) => {
            const row = Math.floor(i / cols);
            return padding + radius + row * (radius * 2 + padding) + 5;
          })
          .attr("text-anchor", "middle")
          .attr("font-size", "17px")
          .attr("fill", "#000")
          .text((d) => (scriptMode === "iast" ? d.iast : d.devanagari));
      });

    // Hide tooltip on moving mouse outside circles
    const onBodyHover = () => {
      tooltip
        .transition()
        .duration(200)
        .style("opacity", 0)
        .on("end", () => tooltip.style("visibility", "hidden"));
    };
    document.body.addEventListener("mouseover", onBodyHover);

    return () => {
      document.body.removeEventListener("mouseover", onBodyHover);
    };
  }, [data, highlightVowel, highlightConsonant, highlightFinal]);

  return (
    <div className="w-full">
      <svg ref={svgRef} className="w-full h-full" />
    </div>
  );
};
