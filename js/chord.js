queue()
    .defer(d3.csv, 'data/Harry.csv')
    .defer(d3.csv, 'data/Ron.csv')
    .defer(d3.csv, 'data/Hermoini.csv')
    .await(makeRankVis);

function makeRankVis(error, harry, ron, hermoini){
    if(error){
        console.log(error);
    }

    var questions = []

    harry.forEach(function(d){
        for(var i in d){
          if(i != "question"){
              d[i] = parseInt(d[i]);
          }
        }
        questions.push(d["question"])
    });

    ron.forEach(function(d){
        for(var i in d){
          if(i != "question"){
              d[i] = parseInt(d[i])
          }
        }
    });

    hermoini.forEach(function(d){
        for(var i in d){
          if(i != "question"){
              d[i] = parseInt(d[i])
          }
        }
    }); 


    // sankey matrix !!!!
    // create input data: a square matrix that provides flow between entities
    var matrix = [
      [0, 0, 0], // harry    // betwwen the characters there is no link
      [0, 0, 0], // ron
      [0, 0, 0], // hermonin

      //[] // questions will be added later
      //[] // questions 
      //[] // questions 
      //[] // questions 
      //[] // questions 
      //[] // questions 
      // ... 
    ];


    var current_movie = "m1";

    // character to the question
    [harry, ron, hermoini].forEach(function(character, i){
        for(var q in character){
            if(q != "columns"){
              matrix[i].push(character[q][current_movie])
            }
        }
    });


    // questions to character
    for(var i = 0; i < questions.length; i++){
        matrix.push([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    }

    for(var i = 3; i < matrix[0].length; i++){
      for(var j = 0; j < matrix[0].length; j++){
          matrix[i][j] = matrix[j][i]
      }      
    }

    // create the svg area
    var svg = d3.select("#chord_diagram")
      .append("svg")
        .attr("width", 440)
        .attr("height", 440)
      .append("g")
        .attr("transform", "translate(220,220)")

    // 4 groups, so create a vector of 4 colors
    var colors = [ "#440154ff", "#31668dff", "#37b578ff"]

    // give this matrix to d3.chord(): it will calculates all the info we need to draw arc and ribbon
    var res = d3.chord()
        .padAngle(0.05)
        .sortSubgroups(d3.descending)
        (matrix)

    // add the groups on the outer part of the circle
    svg
      .datum(res)
      .append("g")
      .selectAll("g")
      .data(function(d) { return d.groups; })
      .enter()
      .append("g")
      .append("path")
        .style("fill", function(d,i){ return colors[i] })
        .style("stroke", "black")
        .attr("d", d3.arc()
          .innerRadius(200)
          .outerRadius(210)
        )

    // Add the links between groups
    svg
      .datum(res)
      .append("g")
      .selectAll("path")
      .data(function(d) { return d; })
      .enter()
      .append("path")
        .attr("d", d3.ribbon()
          .radius(200)
        )
        .style("fill", function(d){ return(colors[d.source.index]) }) // colors depend on the source group. Change to target otherwise.
        .style("stroke", "black");


}