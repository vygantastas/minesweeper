// jshint multistr:true
$(document).ready(function () {
  var field = [[]],
    dist = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1], [0, 0]],
    dif = 5,
    row = 20,
    col = 30,
    mine = 0,
    firstMove = true,
  endGame = false;
  function drawBoard() {
    var show, cell;
    console.log("boarddddddddddd");
    fieldHtml = "<div class='board'>";
    for (var i = 0; i < row; i++)
      for (var j = 0; j < col; j++) {
        cell = field[i][j];
        // else if (cell % 10 == 0)
        // cell = "";


        if (cell >= 100 || cell <= -100)
          show = '<div><i class="fas fa-flag">B</i></div>';
        else if (cell >= 10)
          show = "<div class='free'>" + (cell == 10 ? "" : cell % 10) + "</div>";
        else if (cell < 10 && cell >= -1) // != 0)
          show = "";
        if (endGame && cell == -1)
          show = '<i class="fas fa-bomb"></i>';
        // else if (cell == 0)
        //   show = "<div class='free'></div>";


        // else if (sel >= 10)
        //   else if (cell < 10) // && cell >= -1 )
        //     cell = "";

        // }
        // if (cell == 0)
        //   ;

        fieldHtml += "<div class='cell' style='top:" + i * row + "px; left:" + j * col + "px;'>" + show + "</div>";
      }
    fieldHtml += "</div>";
    $(".field").html(fieldHtml);
  }
  $('.field').on('click', '.start', function () {
    console.log("start start");
    start();
  });

  $('.field').on('click', '.cell', function () {
    var e, s;
    console.log("clicccccccccc");
    s = parseInt($(this).css('left'));
    e = parseInt($(this).css('top'));
    // select (e / 20, (s - (s % 30)) / 30, e, s);
    select(e, s);
  });

  $('.field').on("contextmenu", ".cell", function () {
    s = parseInt($(this).css('left'));
    e = parseInt($(this).css('top'));
    mark(e, s);
    return false;

  }
  );
  // }); 

  function start() {
    console.log("start");
    //    drawBoard(20,   30);

    play();

  }
  function mark(e, s) {
    console.log("mouse right", e, s);
    e = e / row;
    s = s / col;
    cell = field[e][s];
    if (cell < 10 && cell >= -1)
      cell *= 100;
    else if (cell >= 100 || cell <= -100)
      cell /= 100;

    field[e][s] = cell;
    console.log("markkkkkkkkkkk", cell);
    drawBoard();
  }

  function select(e, s) {
    var sel,
      change;
    e = e / row;
    s = s / col;
    // do {
    if (firstMove) {
      for (var d = 0; d < 9; d++) {
        te = e + dist[d][0];
        ts = s + dist[d][1];
        for (var i = 0; i < 9; i++) {
          if (goodPlace(e + dist[d][0], s + dist[d][1])) {
            field[e + dist[d][0]][s + dist[d][1]] = 0;
          }
        }

        // } while (sel != 3); 
      }
      for (var i = 0; i < row; i++)
        for (var j = 0; j < col; j++) {
          if (field[i][j] != 0) {
            num = Math.floor(Math.random() * 10 + 1);
            // console.log(num);
            if (num < dif) {
              // cell = row*col + col;
              field[i][j] = -1;
              mine++;
            }
            else
              field[i][j] = 0;
          }
        }
      for (var i = 0; i < row; i++)
        for (var j = 0; j < col; j++) {
          // console.log("test coord", i, j);
          if (field[i][j] > -1) {
            countAround = 0;
            for (var d = 0; d < 8; d++) {
              te = i + dist[d][0];
              ts = j + dist[d][1];
              // console.log("test", te, ts);
              if (goodPlace(te, ts, row, col) && field[te][ts] == -1)
                countAround++;
            }
            field[i][j] = countAround;
            // console.log("around", countAround);
          }
          // console.log(field);
        }
      firstMove = false;
    }
    sel = field[e][s];
    console.log(e, s, "eeeeee ssssssssssssssssssss", sel);
    if (sel == 0) {
      change = 10;
      testCoord(e, s);
    }
    else if (sel > 0 && sel < 10)
      change = sel + 10;
    // else if (sel == -1)
    //   change = 9;
    else if (sel > 10)
      change = sel;
    else if (sel == -1) {
      endGame = true;
    }
    field[e][s] = change;
    drawBoard();
  }
  function play(e, s) {
    var
      te, ts, countAround,
      num;
    for (var i = 0; i < row; i++)
      field[i] = (new Array(col)).fill(-1);
    console.log("mmmmmmmm", mine);
    drawBoard(row, col, field);
    // drawBoard(row, col, field);
  }
  function testCoord(e, s) {
    var te, ts;
    for (var d = 0; d < 8; d++) {
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
      // console.log("field10000000000000",te, ts, field[te][ts]);
    }
  }
  function goodPlace(e, s) {
    return (e >= 0 && s >= 0 && e < row && s < col);
  }
});
