// jshint multistr:true
$(document).ready(function () {
  var field = [[]],
    dist = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1], [0, 0]],
    emotions = ["🙂", "😐", "🤔", "😮", "😬", "🙄", "😞", "😴"], EMOTION_INTERVAL = 3, CELL_SIZE = 20,
    emotionsAfter = ["🤨", "🤨", "😉", "😛", "😎", "🤩", "😊", "😗"],
    row = 20, col = 30, mines = 0, bomb, e, s, time = 0, level = 0, tm, inactivity = 0,
    actionTime = 0, nowSize = 0, nowLevel = 0,
    firstMove = true, endGame = false, show, cell, happyGame = false, visible = true, menuSelected = false;
  sBoard = { row: 20, col: 30 }
  mBoard = { row: 30, col: 45 }
  lBoard = { row: 40, col: 60 }
  boardSize = { data: ["Small", "Medium", "Large"], size: [sBoard, mBoard, lBoard], select: 0 };
  level = { data: ["Easy", "Medium", "Hard"], select: 0 };

  // selectMenu(0);
  play(0);

  function drawBoard() {
    bomb = 0;
    fieldHtml = "<div class='board'>";
    for (var i = 0; i < row; i++)
      for (var j = 0; j < col; j++) {
        cell = field[i][j];
        if (happyGame) {
          show = "<div class='free'>";
          if (cell < 0)
            show += '<i class="fa fa-bomb"></i>';
          show += "</div>";
        }
        else {
          if (cell >= 100 || cell <= -100) {
            bomb++;
            show = '<div><i class="fa fa-exclamation"></i></div>';
          }
          else if (cell >= 10) {
            show = "<div class='free' style='color:#" + (7 + parseInt(cell % 10)).toString(16) + "00;'>" + (cell == 10 ? "" : cell % 10) + "</div>";
          }
          else if (cell < 10 && cell >= -1) // != 0)
            show = "";
          if (endGame && cell == -1)
            show = '<i class="fa fa-bomb"></i>';
        }
        fieldHtml += "<div class='cell'>" + show + "</div>";
      }
    fieldHtml += "</div>";
    $(".field").html(fieldHtml);
    $(".bombs").html(mines - bomb);
  }

  $(".view").click(function (event) {
    console.log("vieWWWWWWWWWWWWWW", event, "this", this);
    if (event.target !== this)
      return;
    if (visible) {
      clearInterval(tm);
      // $(".view").css("z-index", "1");
      $(".container").css("z-index", "-1");
    }
    else {
      if (!firstMove && !endGame && !happyGame)
        tm = setInterval(timer, 1000);
      // $(".view").css("z-index", "0");
      $(".container").css("z-index", "1");
      // $(".view img").css("z-index", "1");
    }
    visible = !visible;
    console.log("backgroundDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDd");
    console.log(($(".view").css("height")), "heighTTTTTTTTTTTTTTTTttt");

    // if (!$(event.target).hasClass("header timer"))
  });

  $('.size').on('click', 'div', function () {
    var menuChoice;
    menuSelected = true;
    menuChoice = $(this).index();
    console.log("change size", menuChoice);
    selectMenu(menuChoice);
  });

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
  { console.log("Double click"); });

  function selectMenu(sel) {
    var menuHtml = "";
    if (sel == 4) {
      endGame = false;
      firstMove = true;
      mines = 0;
      happyGame = false;
      clearTimeout(tm);
      time = 0;
      // if (menuSelected) {
      nowSize = boardSize.select;
      nowLevel = level.select;
      // }
      menuSelected = false;
      // $('.timer').html ("0");
      play(boardSize.select);
    }
    if (sel < 4 && sel > 0) {
      boardSize.select = sel - 1;
    } else if (sel > 4 && sel < 8) {
      level.select = sel - 5;
    } else if (sel == 9) {
      boardSize.select = nowSize;
      level.select = nowLevel;
      menuSelected = false;
    }
    menuHtml = '<div class="timer">0</div>' + menuStr(boardSize) + '<div class="smile"><span>🙂</span></div>' + menuStr(level) + '<div class="bombs">0</div>';
    $(".size").html(menuHtml);
  }

  function menuStr(bar) {
    selHtml = "";
    for (var i = 0; i < 3; i++) {
      selHtml += "<div class='choice";
      if (i == bar.select)
        selHtml += " selected";
      selHtml += "'>" + bar.data[i] + "</div>";
    }
    return selHtml;
  }

  function mark() {
    if (menuSelected)
      selectMenu(9);
    console.log("mouse right", e, s);
    cell = field[e][s];
    if (cell == 0)
      cell = 1000;
    else if (cell < 10 && cell >= -1)
      cell *= 100;
    else if (cell >= 1000)
      cell = 0;
    else if (cell >= 100 || cell <= -100)
      cell /= 100;
    field[e][s] = cell;
    actionTime = timer();
    drawBoard();
  }

  function timer() {
    var emotion;
    console.log("ttttttimer");
    time++;
    if (time < 10000)
      $(".timer").html(time);
    else
      clearTimeout(tm);
    console.log("timerrrrrrrrrrrrrrrrr ", inactivity, time, actionTime);
    if ((time - actionTime) == 1) {
      emotion = emotionPic(emotionsAfter);
      // emotion = emotionsAfter[Math.floor(inactivity / EMOTION_INTERVAL)];
      // console.log(emotionsAfter[Math.floor(inactivity / EMOTION_INTERVAL)], Math.floor(inactivity / EMOTION_INTERVAL));
    } else {
      inactivity = time - actionTime;
      console.log("timer ", inactivity);
      if (inactivity % EMOTION_INTERVAL == 0)
        emotion = emotionPic(emotions);
      // if (inactivity < EMOTION_INTERVAL * emotions.length) {
      //   if (inactivity % EMOTION_INTERVAL == 0)
      //     emotion = emotions[((inactivity) / EMOTION_INTERVAL)];
      // }
      // else
      //   emotion = emotions[emotions.length - 1];
    }
    $(".smile").html(emotion);
    return (time);

    function emotionPic(emotionList) {
      console.log(emotionList, inactivity);
      if (inactivity < EMOTION_INTERVAL * emotionList.length) {
        // if (inactivity % EMOTION_INTERVAL == 0)
        emotion = emotionList[Math.floor(inactivity / EMOTION_INTERVAL)];
      }
      else
        emotion = emotionList[emotionList.length - 1];
      console.log(emotion, "EMO");
      return (emotion);
    }

  }
  function select() {
    var sel, knownCell = 0, countAround, change;
    actionTime = timer();
    if (menuSelected)
      selectMenu(9);
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
              testCoord(te, ts);
            }
            else if ((field[te][ts] > 99 || field[te][ts] < -99)) {
            }
            else if (field[te][ts] != -1)
              field[te][ts] = field[te][ts] % 10 + 10;
            else if (field[te][ts] == -1)
              endGame = true;
          }
        }
      }
    }
    if (sel == -1 || endGame) {
      change = -1;
      endGame = true;
      stopTime("😢");
    }
    field[e][s] = change;
    for (var i = 0; i < row; i++)
      for (var j = 0; j < col; j++) {
        if (field[i][j] >= 10 || field[i][j] < -99)
          knownCell++;
      }
    if ((knownCell + mines - bomb) == (row * col)) {
      happyGame = true;
      stopTime("😀");
    }
    drawBoard();
  }

  function stopTime(emotion) {
    console.log("stop Time", emotion);
    clearTimeout(tm);
    $(".smile").html(emotion);
  }

  function play(boardSel) {
    row = boardSize.size[boardSel].row;
    col = boardSize.size[boardSel].col;
    viewHight = parseInt($(".view").css("height"));
    if (viewHight > row * CELL_SIZE + 50)
      viewHight = viewHight + 45 - (viewHight - row * CELL_SIZE) / 2;
    for (var i = 0; i < row; i++)
      field[i] = (new Array(col)).fill(-1);
    $(".container").css("width", col * CELL_SIZE + 6);
    $(".container").css("height", row * CELL_SIZE + 6);
    console.log(($(".view").css("height")), "heighTTTTTTTTTTTTTTTTttt");
    $(".container").css("margin-top", - viewHight); //-row * 20 - (viewHight - ( row * 20) / 1 ) );
    selectMenu(0);
    drawBoard();
  }
  // function delImageDiv() {
  //   // var xhr = new XMLHttpRequest();
  //   // xhr.open('HEAD', "../img/house.jpg", false);
  //   // xhr.send();

  //   // var fs = require("fs");
  //   // if (fs.exists("../img/house.jpg"))
  //   // console.log("file exist");
  //   //   else
  //   console.log("file NOT exist");
  //   $(".view").html("");
  // }

  function testCoord(e, s) {
    var te, ts;
    for (var d = 0; d < 9; d++) {
      te = e + dist[d][0];
      ts = s + dist[d][1];
      // console.log("test", te, ts);
      if (goodPlace(te, ts))
        if (field[te][ts] == 0) {
          field[te][ts] = (field[te][ts] + 10);
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
