'use strict';

{


  let abc = ['A', 'B', 'C', 'D', 'E'];
  let resultData = localStorage.getItem('key');
  resultData = JSON.parse(resultData);

  const ufo = document.querySelector('.ufo');
  ufo.addEventListener('click', () => {
    ufo.classList.add('clicked');
  });

  // reload時
  let isReload = false;
  window.addEventListener('load', () => {
    const perfEntries = performance.getEntriesByType('navigation');
    isReload = perfEntries[0].type === 'reload';
    if (isReload) {
      console.log('reload');
      document.querySelector('html').style.height = '100%';
      window.scrollTo(0, 0);
    }
  });

  // circle, crossのスタイル
  // const divStatus = document.querySelector('div.status');
  // const hrs


// "3/5"(正答数/問題数)表示部分
  const pNOfCorrect = document.querySelector('h2#n-of-corrects');
  const pNOfQuestion = document.querySelector('p#n-of-questions');
  // resultDataのうちcorrectプロパティにtrueであるオブジェクトを探して、
  // 見つけた回数をnOfCorrectに記録
  let nOfCorrect = 0;
  resultData.filter((data) => {
    if (data.correct) { nOfCorrect++; }
  });
  // "3"
  pNOfCorrect.textContent = nOfCorrect;
  // "/5"
  pNOfQuestion.textContent = `/${resultData.length}`;


  const sectionHitoriesCont = document.querySelector('section#histories-container');
  for (let i = 1; i <= resultData.length; i++) {
    let pQNum, pQSentence, pCorrAns, divCircle, divCross, liChoices, pChoices;
    if (i === 1) {// 1問目のhtmlはresult.htmlに記述済み
      pQNum = document.querySelector('.q-number');
      pQSentence = document.querySelector('.q-sentence');
      pCorrAns = document.querySelector('p.correct-answer');
      divCircle = document.querySelector('.circle');
      divCross = document.querySelector('.cross');
      liChoices = document.querySelectorAll('ul.choices li');
      pChoices = document.querySelectorAll('ul.choices p');
    } else {// 2問目以降は1問目のhtmlをコピーして編集
      // articleを子孫要素込みでコピー
      const cloneArticle = document.querySelector('article').cloneNode(true);
      // ペースト
      sectionHitoriesCont.appendChild(cloneArticle);

      pQNum = cloneArticle.querySelector('.q-number');
      pQSentence = cloneArticle.querySelector('.q-sentence');
      pCorrAns = cloneArticle.querySelector('p.correct-answer');
      divCircle = cloneArticle.querySelector('.circle');
      divCross = cloneArticle.querySelector('.cross');
      liChoices = cloneArticle.querySelectorAll('ul.choices li');
      pChoices = cloneArticle.querySelectorAll('ul.choices p');
    }




    pQNum.textContent = i;
    pQSentence.innerHTML = `<span class="start">.</span>${resultData[i-1].question}<span class="end">.</span>`;
    pChoices.forEach((pChoice, j) => {
      pChoice.innerHTML = `<span class="start">.</span>${resultData[i-1].choices[j].html}<span class="end">.</span>`;
    });



    abc.forEach(a => {
      pCorrAns.classList.remove(a.toLowerCase());
    });
    let correctIndex;
    resultData[i-1].choices.filter((choice, index) => {
      if (choice.correct) correctIndex = index;
    });
    console.log(correctIndex);
    pCorrAns.textContent = abc[correctIndex];
    pCorrAns.classList.add(abc[correctIndex].toLowerCase());


    divCircle.classList.remove('show');
    divCross.classList.remove('show');
    if (resultData[i-1].correct) {
      divCircle.classList.add('show');
      if (window.innerWidth < 750) { pQNum.style.background = 'darkred'; }
    } else if(!resultData[i-1].correct) {
      divCross.classList.add('show');
      if (window.innerWidth < 750) { pQNum.style.background = 'var(--color-dark-blue)'; }
    }

    liChoices.forEach(liChoice => {
      liChoice.classList.remove('choiced');
    });
    liChoices[resultData[i-1].choiced].classList.add('choiced');


  }

  const timeoutIds = {};
  const pQSentences = document.querySelectorAll('p.q-sentence');
  const ulChoices = document.querySelectorAll('ul.choices');


  let artHistoryConts = document.querySelectorAll('.history-container');
  let artWidth = artHistoryConts[0].getBoundingClientRect().width;
  console.log(artWidth);
  console.log(window.innerWidth);

  if (window.innerWidth > 750) {
    artHistoryConts.forEach(article => {
      article.style.height = `${artWidth * .75}px`;
    });
  }



  artHistoryConts.forEach((cont, i) => {
    let pChoices = ulChoices[i].querySelectorAll('ul.choices p');
    pChoices = [...pChoices];
    const flowNodes = pChoices.filter(hasOverflow);
    if (hasOverflow(pQSentences[i])) { flowNodes.unshift(pQSentences[i]); }
    // console.log(flowNodes);

    // addEventListener
    // ハンドラに引数を渡す方法: mouseEnter()参照
    cont.addEventListener('click', contEventHandler(cont, flowNodes));
    cont.addEventListener('mouseenter', contEventHandler(cont, flowNodes));
    cont.addEventListener('mouseleave', contEventHandler(cont, flowNodes));

  });

  const ulNav = document.querySelector('nav ul');
  const ulNavBtmY = ulNav.getBoundingClientRect().bottom + window.scrollY;
  const btnResult = document.querySelector('.link-result button');
  const liParent = btnResult.parentNode.parentNode;
  const liBtmY = liParent.getBoundingClientRect().bottom + window.scrollY;
  const yForliScroll = ulNavBtmY - liBtmY;
  const liDammyResult = document.querySelector('.dammy-result');
  const liStyles = window.getComputedStyle(liParent);
  const liFontSize = Number(liStyles.getPropertyValue('font-size').replace('px', '')); // 64



  btnResult.addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelector('html').style.overflowY = 'visible';
    document.querySelector('html').style.height = 'auto';

    // console.log('liFontSize: ' + liFontSize);

    // margin-scroll-top
    const marginScrollTop = liFontSize; // 64
    // windowのスクロール距離
    const yForWinScroll = ulNavBtmY - liFontSize * 2 - marginScrollTop; // ul - 128 - 64

    // 画面をスクロール
    scrollTo(0, yForWinScroll);

    /* (element.)animate(1, 2)メソッド
      1: keyframesオブジェクトから成る配列
        offsetプロパティでdurationに対する実行時間をしていできる。
      2: optionを指定するオブジェクト。
    */
    liParent.animate(
      [
        { transform: 'translateY(0)', /* offset: 0, */ },
        { transform: `translateY(${yForliScroll}px)`, /* offset: 1.0, */ },
      ],
      {
        duration: 600,
        easing: 'linear',
        /* fill: 'forwards' → anime終端フレームの状態を保持して終了
        未指定だと初期状態に勝手に戻る。*/
       // fill: 'forwards',
      }
    );
    setTimeout(() => {
      liDammyResult.classList.add('show');
      btnResult.classList.add('hidden');
    }, 600);

  });




  const liToTopBtmY = document.querySelector('li.link-top').getBoundingClientRect().bottom + window.scrollY;
  const upperBoundary = liToTopBtmY - liFontSize * 2;
  const lowerBoundary = ulNavBtmY - liFontSize * 4;

  let oldWinBtmY = window.scrollY + window.innerHeight;
  window.addEventListener('scroll', () => {
    let newWinBtmY = window.scrollY + window.innerHeight;
    console.log(upperBoundary);

    // scroll "Down": 下方向にスクロールした場合
    if (newWinBtmY > oldWinBtmY) {
      console.log('down');

      // li.dammy-result をfade OUT
      if (window.scrollY > lowerBoundary) {
        liDammyResult.classList.remove('fade-out');
        liDammyResult.classList.add('show');
      }

      // li.link-result を fade IN
      if (window.scrollY > upperBoundary) { btnResult.classList.add('hidden'); }
      
    }

    // scroll "UP": 上方向にスクロールした場合
    else {
      console.log('UP');

      // li.dammy-result をfade IN
      if (window.scrollY < lowerBoundary) {
        liDammyResult.classList.add('fade-out');
        liDammyResult.classList.remove('show');
      }

      // li.link-result を fade OUT
      if (window.scrollY < upperBoundary) { btnResult.classList.remove('hidden'); }

    }

    oldWinBtmY = window.scrollY + window.innerHeight;
  });



  // 無名関数を渡す、引数持ちの関数をハンドラとして使う
  function contEventHandler(cont, flowNodes) {
    return (e) => {
      if (e.type === 'click') {
        cont.classList.toggle('open');
        if (cont.classList.contains('open')) {
          if (window.innerWidth > 750) { cont.style.height = `${artWidth / 3 * 4}px`; }
          setFlow(flowNodes);
        }
        else {
          if (window.innerWidth > 750) { cont.style.height = `${artWidth * .75}px`; }
          stopFlow(flowNodes) }
      }
      if (!cont.classList.contains('open')) { return; } // 早期リターン
      if (cont.classList.contains('open')) {
        if (e.type === 'mouseenter') {
          console.log('add class of "flow"  &  loop text');
          setFlow(flowNodes);
        }

        if (e.type === 'mouseleave') {
          console.log('remove class of "flow"  &  stop looping the text');
          stopFlow(flowNodes);
        }
      }

    };
  }
  function setFlow(flowNodes) {
    flowNodes.forEach(flowNode => {
      flowNode.querySelector('span.end').classList.add('flow');
      flowNode.classList.add('flow');
      flowText(flowNode);
    });
  }
  function stopFlow(flowNodes) {
    flowNodes.forEach(flowNode => {
      flowNode.querySelector('span.end').classList.remove('flow');
      flowNode.classList.remove('flow');
      stopText(flowNode);
    });
  }


  function flowText(textElm) {
    const cloneElm = textElm.cloneNode(true); // cloneNode(boolean: 子要素まで含めるか)
    textElm.parentNode.appendChild(cloneElm);

    let s = 0;        // textElmの１周期毎の距離
    let t = 0;        // cloneElmの１周期毎の距離
    let sSum = 0;     // 左への相移動距離
    let d = 3;        // インクメント [px/10ms]

    const textElmLength = getTextElmLength(textElm).blockWidth; // [px]
    /* 使わないけど...
    const speed = (d / 10) * 1000; // [px/s]
    const halfPeriod = textElmLength / speed; // [s]
    */
    function flow() {
      timeoutIds[TextToKey(textElm)] = setTimeout(() => {
        if (sSum < textElmLength + d) {
          if (s > textElmLength) {
            textElm.style.transform = `translateX(${textElmLength}px)`;
            s = 0;
            sSum = 100000;
          } else {
            textElm.style.transform = `translateX(${-1 * s}px)`;
            s += d;
            sSum += d;
          }
        } else if (s > 2 * textElmLength) {
          textElm.style.transform = `translateX(${textElmLength}px)`;
          s = 0;
        } else {
          textElm.style.transform = `translateX(${textElmLength -1 * s}px)`;
          s += d;
        }

        if (t > 2 * textElmLength) {
          cloneElm.style.transform = `translateX(0)`;
          t = 0;
        } else {
          cloneElm.style.transform = `translateX(${-1 * t}px)`;
          t += d;
        }
        flow();
      }, 40);
    }
    flow();
  }
  function stopText(textElm) {
    clearTimeout(timeoutIds[TextToKey(textElm)]);
    textElm.nextElementSibling.remove();
    textElm.style.transform = 'translateX(0)';
  }


  function getTextElmLength(textElm) {
    const spanStart = textElm.querySelector('span.start');
    const spanEnd = textElm.querySelector('span.end');

    // window.scrollXはどうせ差を取るからいらないけど。
    const startSpanLeft = spanStart.getBoundingClientRect().left + window.scrollX;
    const startSpanRight = spanStart.getBoundingClientRect().right + window.scrollX;
    const endSpanLeft = spanEnd.getBoundingClientRect().left + window.scrollX;
    const endSpanRight = spanEnd.getBoundingClientRect().right + window.scrollX;

    const textWidth = endSpanLeft - startSpanRight;
    const blockWidth = endSpanRight - startSpanLeft;
    const sizes = {'textWidth': textWidth, 'blockWidth': blockWidth};
    return sizes;
  }
  function hasOverflow(textElm) {
    const maxLength = textElm.parentNode.getBoundingClientRect().width;
    const length = getTextElmLength(textElm).textWidth;
    return maxLength < length;
  }
  function TextToKey(textElm) {
    const parentDiv = textElm.parentNode;
    if (parentDiv.classList.contains('q-sentence-container')) {
      return 'sentence';
    }
    if (parentDiv.classList.contains('choice-txt-container')) {
      let liElms = document.querySelectorAll('ul.choices li');  // ← HtmlCollection
      liElms = [...liElms];                                     // HtmlCollectionを配列に変換
      return `choice-${liElms.indexOf(parentDiv.parentNode)}`;
    }
  }
}








































    // console.log('s: ' + s);
    // const sli = ulNavBottomY - liBottomY;

    // // 時刻t, 距離yの物理変数
    // const y0 = locOnClick;
    // let t = 0, y = y0;
    // let yli = 0; 

    // // t1まで等加速度運動(加速)、t2まで等速度運動、t3まで等加速度運動(減速; 最後速度0)
    // const t1 = 300, t2 = 700, t3 = 1000; // [ms]

    // // ▼ (verocity = ) dy/dt = at + C における加速度a(本当はa * dt)にあたる。
    // // 区間1:  0 ~ t1
    // const a1 = (2 * s * dt) / (t1 * (t2 - t1 + t3));
    // // 区間2: t1 ~ t2; 等速運動なので、ここでは加速度ではなく、単にdt(一定)に対するdyの意味
    // const dy2 = (2 * s * dt) / (t2 - t1 + t3);
    // // 区間3: t2 ~ t3
    // const a3 = (2 * s * dt) / ((t2 -t3) * (t2 - t1 + t3));

    // // list elmの加速度
    // const ali1 = (2 * sli * dt) / (t1 * (t2 - t1 + t3));
    // const dyli2 = (2 * sli * dt) / (t2 - t1 + t3);
    // const ali3 = (2 * sli * dt) / ((t2 -t3) * (t2 - t1 + t3));


    // function excuteScroll(dy, yli) {
    //   scrollBy(0, dy);
    //   liParent.style.transform = `translateY(${yli + ali1 * dt}px)`;
    // }

    // document.querySelector('html').animate([
    //   {
    //     scrollTo: '0px',
    //     offset: 0,
    //   },
    //   {
    //     scrollTo: '500px',
    //     offset: 100,
    //   },
    // ], 5000);

    // if (!(y0 === 0)) {
    //   console.log('passed');
    //   liParent.animate([
    //     {
    //       transform: 'translateY(0)',
    //       offset: 0,
    //     },
    //     {
    //       transform: 'translateY(100px)',
    //       offset: 1.0,
    //     }
    //   ], 5000);
    // }
  //   scrollBy(0, a1 * dt);

  //   let intervalId = setInterval(() => {
  //     // 区間1
  //     if (t <= t1) {
  //       dy = a1 * t;                      // 徐々に加速
  //       dyli = ali1 * t;
  //       excuteScroll(dy, yli);              // スクロールの実行※if-elseの後に書くと最後に1回余計に実行される
  //     }
  //     // 区間2
  //     else if (t1 < t && t <= t2) {
  //       dy = dy2;                      // ここは等速
  //       dyli = dyli2;
  //       excuteScroll(dy, yli);
  //     }
  //     // 区間3
  //     else if (t < t3) {
  //       dy = a3 * (t - t3);               // 徐々に減速
  //       dyli = ali3 * (t - t3);
  //       excuteScroll(dy, yli);
  //     }

  //     // 目標座標に達したらタイマークリア
  //     else {
  //       console.log('clear');
  //       clearInterval(intervalId);
  //       console.log(ulNav.getBoundingClientRect().bottom);
  //       console.log(`diff = ${finalY - window.scrollY}`);
  //     }
      
  //     // t3 +dt 経過で強制終了; 何かあったとき用。
  //     if (t > t3 + dt * 2) {
  //       console.log('stoped');
  //       clearInterval(intervalId);
  //     }


  //     // 経過時間t、移動距離yの更新
  //     t += dt;
  //     y += dy;
  //     yli += dyli;

  //   }, dt);

  //   // t3[s]後(intervalのスクロールが完了後)li要素を固定
  //   // これで高さ方向のresizeでresultを固定している。
  //   setTimeout(() => {
  //     liParent.style = 'translateY(0)';
  //     liParent.style.alignSelf = 'flex-end';
  //     console.log('excuted');
  //   }, t3  + dt * 3);