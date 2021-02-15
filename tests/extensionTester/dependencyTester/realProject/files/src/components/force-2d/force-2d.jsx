import React, { useRef, useEffect, useCallback } from 'react';
import styles from "./force-2d.scss";
import { Link } from 'react-router-dom';
import * as d3 from 'd3';
import colorlist from "../datas/colorlist";

import { connect } from 'react-redux';

import llp from "layered-label-propagation"

function Force2D(props) {
  const chartArea = useRef();
  const data = JSON.parse(JSON.stringify(props.data));
  const dataIds = [];
  for (let i = 0; i < data.nodes.length; i++) {
    dataIds.push(data.nodes[i].id);
  }
  const dataforLLp = {
    nodes: dataIds,
    links: data.links
  };



  const width = 800;
  const height = 800;
  let currNodes = data.nodes;
  let currLinks = data.links;
  const llpResult = llp.jLayeredLabelPropagation(dataforLLp.nodes, dataforLLp.links, 0, 100);


  var simulation = d3.forceSimulation(currNodes)
    .force("link", d3.forceLink().id(function (d) { return d.id; }))
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(width / 2, height / 2));

  simulation.on('end', () => {
  });

  let color = d3.scaleOrdinal(colorlist)

  const dragstarted = useCallback(d => {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }, [simulation])

  function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }

  const dragended = useCallback(d => {
    if (!d3.event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }, [simulation])

  useEffect(() => {
    const zoom = d3.zoom()
      .scaleExtent([0.1, 1])
      .on("zoom", zoomed);

    let dom = d3.select("svg")
    if (dom) {
      dom.remove();
    }

    const svg = d3.select(chartArea.current)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .call(zoom);

    const link = svg.append("g")
      .attr("class", styles.links)
      .selectAll("line")
      .data(currLinks)
      .enter().append("line");

    const node = svg.append("g")
      .attr("class", styles.nodes)
      .selectAll("circle")
      .data(currNodes)
      .enter().append("circle")
      .attr("r", 10)
      .attr("fill", function (d) { return color(llpResult[d.id]); })
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));
    function zoomed(d) {
      link.attr("transform", d3.event.transform);
      node.attr("transform", d3.event.transform);
    }
    node.append("title")
      .text(d => d.value);

    simulation
      .on("tick", ticked);

    simulation
      .force("link")
      .links(data.links);

    function ticked() {
      link
        .attr("x1", function (d) { return d.source.x; })
        .attr("y1", function (d) { return d.source.y; })
        .attr("x2", function (d) { return d.target.x; })
        .attr("y2", function (d) { return d.target.y; });

      node
        .attr("cx", function (d) { return d.x; })
        .attr("cy", function (d) { return d.y; });
    }
  }, [color, currLinks, currNodes, data.links, dragended, dragstarted, llpResult, simulation])

  return (
    [<div key={'force'} ref={chartArea} className={styles.page}></div>]
  );
}
const mapStateToProps = (state) => {
  if (state) {
    return {
      data: state.data
    };
  } else {
    return {}
  }
};

export default connect(mapStateToProps)(Force2D);
