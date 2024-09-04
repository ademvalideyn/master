 const chart = () => {
    const width = properties.width;
    const height = Math.min(width, properties.height);
    const radius = Math.min(width, height) / 2.1;

    const name = properties.name.get(0, properties.name.length());
    const value = properties.value.get(0, properties.value.length());

    const data = name.map((ename, index) => ({
      name: ename,
      value: value[index]
    }));

   
    const arc = d3.arc()
      .innerRadius(radius * 0.67)
      .outerRadius(radius - 1);

    const pie = d3.pie()
      .padAngle(1 / radius)
      .sort(null)
      .value(d => d.value);

    const color = d3.scaleOrdinal()
      .domain(data.map(d => d.name))
      .range(d3.schemeSpectral[data.length] || d3.schemeSpectral[11]);

    
    const svg = d3.create("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [-width / 2, -height / 2, width, height])
      .attr("style", "max-width: 100%; height: auto;");

    svg.append("g")
    .selectAll("path")
    .data(pie(data))
    .join("path")
    .attr("fill", d => color(d.data.name))
    .attr("d", arc)
    .attr("stroke", properties.pie_border_color)
    .attr("stroke-width", properties.pie_border_width)
    .on("mouseover", function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("transform", "scale(1.05)");
    })
    .on("mouseout", function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("transform", "scale(1)");
    })
    .append("title")
    .text(d => `${d.data.name}: ${d.data.value.toLocaleString()}`);

svg.append("g")
    .attr("font-family", properties.font_style)
    .attr("font-size", properties.text_size)
    .attr("text-anchor", "middle")
    .selectAll("text")
    .data(pie(data))
    .join("text")
    .attr("transform", d => `translate(${arc.centroid(d)})`)
    .attr("fill", properties.font_color)
    .call(text => text.append("tspan")
        .attr("y", "-0.4em")
        .attr("font-weight", "bold")
        .text(d => d.data.name))
    .call(text => text.filter(d => (d.endAngle - d.startAngle) > 0.25).append("tspan")
        .attr("x", 0)
        .attr("y", "0.7em")
        .attr("fill-opacity", 0.7)
        .text(d => d.data.value.toLocaleString()));

return svg.node();
  };
      
      const container = document.getElementById("container");
if (container) {
    container.innerHTML = '';
    container.appendChild(chart());
} else {
    console.error('Container element not found.');
}

container.style.textAlign = 'center';
container.style.backgroundColor = properties.pie_background_color;
}
