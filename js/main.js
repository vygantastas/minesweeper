// jshint multistr:true
$(document).ready(function () {
  var field = [[]],
    dist = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1], [0, 0]],
    dif = 2, row = 20, col = 30, mines = 0, bomb, e, s, time = 0, sizeSel = 0, level = 0, tm, openCell,
    firstMove = true, endGame = false, show, cell, happyGame = false, visible = true;
  size = {
    data: ["Small", "Medium", "Large"], select: 0
  };
  level = {
    data: ["Easy", "Medium", "Hard"], select: 0
  };
  selectMenu(0);
  function drawBoard() {
    console.log("boarddddddddddd", mines);
    fieldHtml = "<div class='board'>";
    bomb = 0;
    for (var i = 0; i < row; i++)
      for (var j = 0; j < col; j++) {
        cell = field[i][j];
        // else if (cell % 10 == 0)
        // cell = "";
        if (happyGame) {
          console.log("HAPPPPPPPPPPY");
          show = "<div class='free'>";
          if (cell < 0)
            show += '<i class="fa fa-bomb"></i>';
          show += "</div>";
          //   show = "";
          // else
        }
        else {
          if (cell >= 100 || cell <= -100) {
            bomb++;
            openCell++;
            // show = '<div><i class="fa fa-flag"></i></div>';
            show = '<div><i class="fa fa-exclamation"></i></div>';
          }
          else if (cell >= 10) {
            show = "<div class='free' style='color:#" + (7 + parseInt(cell % 10)).toString(16) + "00;'>" + (cell == 10 ? "" : cell % 10) + "</div>";
            openCell++;
          }
          else if (cell < 10 && cell >= -1) // != 0)
            show = "";
          if (endGame && cell == -1)
            show = '<i class="fa fa-bomb"></i>';
          // else if (cell == 0)
          //   show = "<div class='free'></div>";
          // else if (sel >= 10)
          //   else if (cell < 10) // && cell >= -1 )
          //     cell = "";
          // }
          // if (cell == 0)
          // fieldHtml += "<div class='cell' style='top:" + i * row + "px; left:" + j * col + "px;'>" + show + "</div>";
          // fieldHtml += "<div class='cell' style='top:" + i * row + "px; left:" + j * col + "px;'>" + show + "</div>";
        }
        fieldHtml += "<div class='cell'>" + show + "</div>";
      }
    fieldHtml += "</div>";
    // $(".size").html(selectMenu(size.select));
    $(".field").html(fieldHtml);
    $(".bombs").html(mines - bomb);

    console.log("OPEN CELL", bomb, openCell);
    openCell = 0;
  }
  $(".view img").click(function (event) {
    if (event.target !== this)
      return;
    if (visible) {
      clearInterval(tm);
      // $(".view").css("z-index", "1");
      $(".container").css("z-index", "-1");
    }
    else {
      tm = setInterval(timer, 1000);
      
      // $(".view").css("z-index", "0");
      $(".container").css("z-index", "1");
      // $(".view img").css("z-index", "1");
    }
    visible = !visible;
    console.log("background");

    // if (!$(event.target).hasClass("header timer"))

  });
  $('.size').on('click', 'div', function () {
    var size;
    size = $(this).index();
    console.log("change size", size);
    selectMenu(size);
  });
  // $('.field').on('click', '.start', function () {
  //   start();
  // });

  $('.field').on('click', '.cell', function () {
    index = $(this).index();
    s = index % col;
    e = (index - s) / col;
    console.log(index, e, s);
    select(e, s);
  });

  $('.field').on("contextmenu", ".cell", function () {
    // s = parseInt($(this).css('left'));
    index = $(this).index();
    s = index % col;
    e = (index - s) / col;
    console.log(index, e, s);
    mark(e, s);
    return false;
  });

  $('.field').on('dblclick', '.board', function () //Double click
  {
    to
    console.log("Double click");
  });
  function selectMenu(sel) {
    var menuHtml = "";
    if (sel == 3) {
      endGame = false;
      firstMove = true;
      mines = 0;
      happyGame = false;
      // openCell = 0;
      // clearInterval(tm);
      clearTimeout(tm);
      time = 0;
      $('.timer').html("0");
      play();
    }
    if (sel < 3) {
      size.select = sel;
    } else if (sel > 3) {
      level.select = sel - 4;
    }
    menuHtml = menuStr(size) + '<div class="smile"><i class="far fa-frown"></i><span>&#9786;</span></div>' + menuStr(level);


    // console.log("select MENU", sel);
    $(".size").html(menuHtml);
    // return (menuHtml(size.data, sel));
  }

  function menuStr(bar) {
    selHtml = "";
    for (var i = 0; i < 3; i++) {
      selHtml += "<div><button";
      if (i == bar.select) {
        // size.select = sel;
        selHtml += " class='selected'";
      }
      selHtml += ">" + bar.data[i] + "</button></div>";
    }
    console.log(selHtml);
    return selHtml;
  }

  // function start() {
  //   console.log("start"); //    drawBoard(20,   30);
  //   play();
  // }

  function mark() {
    console.log("mouse right", e, s);
    cell = field[e][s];
    if (cell < 10 && cell >= -1)
      cell *= 100;
    else if (cell >= 100 || cell <= -100)
      cell /= 100;
    field[e][s] = cell;
    drawBoard();
  }
  function timer() {
    time++;
    if (time < 1000) {
      $(".timer").html(time);
    }
    else {
      console.log("timer Stoooop", tm);
      clearTimeout(tm);
    }
  }
  function select() {
    var sel, knownCell = 0, countAround, change;
    if (firstMove) {
      for (var d = 0; d < 9; d++) {
        te = e + dist[d][0];
        ts = s + dist[d][1];
        for (var i = 0; i < 9; i++) {
          if (goodPlace(e + dist[d][0], s + dist[d][1])) {
            field[e + dist[d][0]][s + dist[d][1]] = 0;
          }
        }
      }
      for (var i = 0; i < row; i++)
        for (var j = 0; j < col; j++) {
          if (field[i][j] != 0) {
            num = Math.floor(Math.random() * 10 + 1);
            console.log("NUMMMMMMMMM", num);
            if (num < (level.select + 2)) {       ////+2
              field[i][j] = -1;
              mines++;
            }
            else
              field[i][j] = 0;
          }
        }
      for (var i = 0; i < row; i++)
        for (var j = 0; j < col; j++) {
          if (field[i][j] > -1) {
            countAround = 0;
            for (var d = 0; d < 8; d++) {
              te = i + dist[d][0];
              ts = j + dist[d][1];
              if (goodPlace(te, ts) && field[te][ts] == -1)
                countAround++;
            }
            field[i][j] = countAround;
          }
        }
      firstMove = false;
      tm = setInterval(timer, 1000);
    }

    sel = field[e][s];
    change = 10;
    console.log(e, s, "eeeeee ssssssssssssssssssss", sel);
    if (sel == 0) {
      change = 10;
      testCoord(e, s);
    }
    else if (sel > 0 && sel < 10)
      change = sel + 10;
    else if (sel > 10) {
      change = sel;
      countAround = 0;
      for (var d = 0; d < 8; d++) {
        te = e + dist[d][0];
        ts = s + dist[d][1];
        if (goodPlace(te, ts)) {
          console.log("========", te, ts, field[te][ts]);
          if (field[te][ts] > 99 || field[te][ts] < -99)
            countAround++;
        }
      }
      if (sel % 10 == countAround) {
        for (var d = 0; d < 8; d++) {
          te = e + dist[d][0];
          ts = s + dist[d][1];
          if (goodPlace(te, ts)) {
            if (field[te][ts] == 0) {
              // change = 10;
              testCoord(te, ts);
            }
            else if ((field[te][ts] > 99 || field[te][ts] < -99)) {
              // change = sel;
            }
            else if (field[te][ts] != -1)
              field[te][ts] = field[te][ts] % 10 + 10;
            else if (field[te][ts] == -1)
              endGame = true;
          }
        }
      }
    }
    else if (sel == -1) {
      change = -1;
      endGame = true;
      clearTimeout(tm);
    }
    field[e][s] = change;
    for (var i = 0; i < row; i++)
      for (var j = 0; j < col; j++) {
        if (field[i][j] >= 10 || field[i][j] < -99)
          knownCell++;
      }
    console.log("knownNNNNNN", knownCell, bomb, knownCell + mines - bomb);
    if ((knownCell + mines - bomb) >= (row * col)) {
      console.log("HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHaPPPPPPPPPPPPPPPy");
      happyGame = true;
      clearTimeout(tm);
    }
    drawBoard();
  }
  function play() {
    // var te, ts, countAround, num;
    for (var i = 0; i < row; i++)
      field[i] = (new Array(col)).fill(-1);
    console.log("mmmmmmmm", mines);
    drawBoard(row, col, field);
  }
  function testCoord(e, s) {
    var te, ts;
    for (var d = 0; d < 9; d++) {
      te = e + dist[d][0];
      ts = s + dist[d][1];
      console.log("test", te, ts);
      if (goodPlace(te, ts))
        if (field[te][ts] == 0) {
          //          d++;
          console.log("find 000000000000000");
          field[te][ts] = 10; //(field[te][ts] + 10);
          testCoord(te, ts);
        }
        else
          field[te][ts] = field[te][ts] % 10 + 10;
    }
  }
  function goodPlace(e, s) {
    return (e >= 0 && s >= 0 && e < row && s < col);
  }
});
