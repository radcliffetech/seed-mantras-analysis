import * as d3 from "d3";

import { useEffect, useRef } from "react";

type Bija = {
  id: string;
  iast: string;
  traditional: boolean;
  initialcluster: string;
  vowel: string;
  final: string;
  place?: string;
};

type BijaLink = {
  sourceId: string;
  targetId: string;
};

type BijaLayer = {
  id: string;
  name: string;
  bijas: Bija[];
  links: BijaLink[];
};

type Props = {
  data: BijaLayer[];
};

export const BijaMandala = ({ data }: Props) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!data.length) {
      console.warn("No data available");
      return;
    } else if (!svgRef.current) {
      console.warn("No data or SVG reference available");
      return;
    }

    const ringColorMap = new Map([
      ["layer4", "#e63946"], // red
      ["layer3", "#f1c40f"], // yellow
      ["layer2", "#2ecc71"], // green
      ["layer1", "#3498db"], // blue
      ["layer0", "#9b59b6"], // purple (optional)
    ]);

    const filteredData = data.map((layer) => {
      const filteredBijas = layer.bijas;

      const bijaIds = new Set(filteredBijas.map((bija) => bija.id));
      const filteredLinks = layer.links.filter(
        (link) => bijaIds.has(link.sourceId) && bijaIds.has(link.targetId),
      );

      return {
        ...layer,
        bijas: filteredBijas,
        links: filteredLinks,
      };
    });

    const SVG_WIDTH = 700;
    const SVG_HEIGHT = 700;
    const CENTER_X = SVG_WIDTH / 2;
    const CENTER_Y = SVG_HEIGHT / 2;
    const RING_STEP = 50;
    const CELL_RADIUS = 5;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const wrapper = svgRef.current.parentElement;
    d3.select(wrapper).selectAll(".bija-tooltip").remove();
    const tooltip = d3
      .select(wrapper)
      .append("div")
      .attr("class", "bija-tooltip")
      .style("position", "absolute")
      .style("pointer-events", "none")
      .style("padding", "4px 8px")
      .style("background", "white")
      .style("border", "1px solid #ccc")
      .style("border-radius", "4px")
      .style("font-size", "12px")
      .style("visibility", "hidden")
      .style("opacity", 0)
      .style("z-index", 10);

    // Draw center
    svg
      .append("circle")
      .attr("cx", CENTER_X)
      .attr("cy", CENTER_Y)
      .attr("r", CELL_RADIUS)
      .attr("fill", "#333");

    // Store positions for each bija by id
    const positionMap = new Map<
      string,
      { x: number; y: number; angle: number; radius: number; layerId: string }
    >();

    const allBijas = data.flatMap((l) => l.bijas);
    const allLinks = data.flatMap((l) => l.links);

    // Build position map for all bījas, distributed evenly per ring/layer
    const ringGroupMap = new Map<
      string,
      d3.Selection<SVGGElement, unknown, null, undefined>
    >();

    const defs = svg.append("defs");

    filteredData.forEach((layer, layerIndex) => {
      const radius = RING_STEP * (layerIndex + 1);
      const angleStep = (2 * Math.PI) / layer.bijas.length;

      const ringGroup = svg
        .append("g")
        .attr("class", `layer-${layer.id}`)
        .attr("transform", `rotate(0,${CENTER_X},${CENTER_Y})`);

      ringGroupMap.set(layer.id, ringGroup);

      layer.bijas.forEach((bija, i) => {
        const angle = i * angleStep - Math.PI / 2;
        const x = CENTER_X + radius * Math.cos(angle);
        const y = CENTER_Y + radius * Math.sin(angle);
        positionMap.set(bija.id, { x, y, angle, radius, layerId: layer.id });
      });
    });

    // Draw all links globally (between any visible nodes), underneath nodes
    const visibleBijaIds = new Set(Array.from(positionMap.keys()));
    const linksGroup = svg.append("g").attr("class", "all-links");

    allLinks.forEach(({ sourceId, targetId }) => {
      if (visibleBijaIds.has(sourceId) && visibleBijaIds.has(targetId)) {
        const source = positionMap.get(sourceId);
        const target = positionMap.get(targetId);
        if (source && target) {
          const sourceColor = ringColorMap.get(source.layerId) || "#888";
          const targetColor = ringColorMap.get(target.layerId) || "#aaa";
          const gradId = `link-grad-${sourceId}-${targetId}`;
          const gradient = defs
            .append("linearGradient")
            .attr("id", gradId)
            .attr("gradientUnits", "userSpaceOnUse")
            .attr("x1", source.x)
            .attr("y1", source.y)
            .attr("x2", target.x)
            .attr("y2", target.y);

          gradient
            .append("stop")
            .attr("offset", "0%")
            .attr("stop-color", sourceColor);
          gradient
            .append("stop")
            .attr("offset", "100%")
            .attr("stop-color", targetColor);

          linksGroup
            .append("path")
            .attr("d", `M${source.x},${source.y} L${target.x},${target.y}`)
            .attr("stroke", `url(#${gradId})`)
            .attr("stroke-opacity", 0.3)
            .attr("stroke-width", 0.5)
            .attr("fill", "none");
        }
      }
    });

    // Now draw nodes per ring group
    filteredData.forEach((layer) => {
      // const radius = RING_STEP * (layerIndex + 1);
      const ringGroup = ringGroupMap.get(layer.id);
      if (!ringGroup) return;
      layer.bijas.forEach((bija, i) => {
        const pos = positionMap.get(bija.id);
        if (!pos) return;
        const { x, y } = pos;
        ringGroup
          .append("circle")
          .attr("cx", x)
          .attr("cy", y)
          .attr("r", CELL_RADIUS)
          .attr(
            "fill",
            ringColorMap.get(layer.id) || (bija.traditional ? "#c32" : "#555"),
          )
          .on("mouseover", function () {
            const incoming = allLinks
              .filter((l) => l.targetId === bija.id)
              .map((l) => {
                const src = allBijas.find((b) => b.id === l.sourceId);
                return src ? src.iast : l.sourceId;
              });
            const outgoing = allLinks
              .filter((l) => l.sourceId === bija.id)
              .map((l) => {
                const tgt = allBijas.find((b) => b.id === l.targetId);
                return tgt ? tgt.iast : l.targetId;
              });

            tooltip
              .html(
                `<strong>${bija.iast}</strong><br/>` +
                  `→ ${
                    outgoing.length
                  } link(s):<br/><span style="font-size: 11px">${outgoing.join(
                    "<br/>",
                  )}</span><br/>` +
                  `← ${
                    incoming.length
                  } link(s):<br/><span style="font-size: 11px">${incoming.join(
                    "<br/>",
                  )}</span>`,
              )
              .style("visibility", "visible")
              .transition()
              .duration(120)
              .style("opacity", 1);
          })
          .on("mousemove", function (event) {
            const { clientX, clientY } = event;
            const { left, top } = svgRef.current!.getBoundingClientRect();
            tooltip
              .style("top", `${clientY - top + 10}px`)
              .style("left", `${clientX - left + 10}px`);
          })
          .on("mouseout", function () {
            tooltip
              .transition()
              .duration(120)
              .style("opacity", 0)
              .on("end", () => tooltip.style("visibility", "hidden"));
          });
      });
    });

    // Remove ring rotation: ring groups are not rotated, keep transform as translate(0,0) or omit.

    return () => {
      tooltip.remove();
    };
  }, [data]);

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 700,
        margin: "0 auto",
        position: "relative",
        padding: "12px 0",
      }}
    >
      <svg
        ref={svgRef}
        viewBox="0 0 700 700"
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid meet"
      ></svg>
    </div>
  );
};
