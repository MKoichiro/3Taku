'use strict';

{
  // questions配列の中身
  /*
  const questions = [
    {
      id: 0,
      genre:  undefined,
      question: '『<ruby>富嶽三十六景<rt>ふがくさんじゅうろっけい</rt></ruby>』で知られる葛飾北斎が晩年に名乗ったとされる雅号は次のうちどれ？',
      choices: [
        { correct: true, html: '<ruby>画狂老人卍<rt>がきょうろうじんまんじ</rt></ruby>' },
        { correct: false, html: '<ruby>画神画神<rt>がしんがしん</rt></ruby>' },
        { correct: false, html: '<ruby>自画自賛人<rt>じがじさんじん</rt></ruby>' },
      ],
      commentHtml: '<p>北斎は、本人の70代半ばにあたる天保5年（1834年）から「画狂老人卍（がきょうろうじんまんじ）」の号を用いる。『富嶽百景』を手がける。</p>',
    },

    {
      genre:  undefined,
      question: '次のうち明治時代の力士の四股名として実在したものはどれ？',
      choices: [
        { correct: true, html: '<ruby>自転車早吉<rt>じてんしゃはやきち</rt></ruby>' },
        { correct: false, html: '<ruby>俺男<rt>おれお</rt></ruby>' },
        { correct: false, html: '<ruby>肥満君<rt>ひまんぎみ</rt></ruby>' },
      ],
      commentHtml: '<p>自動車早太郎もいる。</p>',
    },

    {
      genre:  undefined,
      question: '次のうち新幹線より速いものはどれ？',
      choices: [
        { correct: true, html: '人のくしゃみ' },
        { correct: false, html: 'テニスのサービス' },
        { correct: false, html: '鳥のハヤブサ' },
      ],
      commentHtml: '<p>新幹線：時速300km/h、くしゃみ：320km/h、テニス：240km/h、ハヤブサ：300km/h。</p>',
    },
  ];
  */

  // function hasLineBreak(textNode) {
  //   let range = new Range();
  //   console.log(textNode);
  //   range.selectNode(textNode);
  //   console.log(range);
  //   console.log(range.getClientRects());
  //   return range.getClientRects().length;
  // }


  function getNumOfLines(textElms) {
    const startRect = textElms.querySelector('span.start');
    const endRect = textElms.querySelector('span.end');
    const startCoordinate = startRect.getBoundingClientRect().bottom;
    const endCoordinate = endRect.getBoundingClientRect().bottom;

    const compedStyle = window.getComputedStyle(textElms);
    const fontSize = compedStyle.getPropertyValue('font-size');
    const fontSizeFormatted = Number(fontSize.replace('px', ''));

    const lineHeight = fontSizeFormatted * 1.5;
    const lines = Math.round((endCoordinate - startCoordinate) / lineHeight) + 1;

    return lines;
  }


  function csvToArray(path) {
    // CSVファイルを取得
    let csv = new XMLHttpRequest();

    // CSVファイルへのパス
    csv.open('GET', path, false);

    // csvファイル読み込み失敗時のエラー対応
    try {
      csv.send(null);
    } catch (err) {
      console.log(err);
    }

    // 配列を定義
    let csvArray = [];

    // 改行ごとに配列化
    let lines = csv.responseText.split(/\r\n|\n/);

    // 1行ごとに処理
    for (let i = 0; i < lines.length; ++i) {
      let cells = lines[i].split(',');
      if (cells.length != 1) {
        csvArray.push(cells);
      }
    }

    // 配列を返す
    return csvArray;
  }
  function getQuestions() {
    let questions = [];
    const csvArray = csvToArray('questions_data.csv');

    for (let i = 0; i < csvArray.length - 1; i++) {
      // 空のオブジェクトを追加
      questions.push({});

      // オブジェクトにchoicesプロパティ以外の各プロパティに値を代入
      questions[i].id = csvArray[i + 1][0];
      questions[i].genre = csvArray[i + 1][1];
      questions[i].question = csvArray[i + 1][2];

      questions[i].commentHtml = csvArray[i + 1][4];

      // choicesプロパティに値を代入
      const tempChoice = [];
      const choices = csvArray[i + 1][3].split('%%');
      tempChoice[0] = { correct: true, html: `<span class="coordinate-checker start"></span>${choices[0]}<span class="coordinate-checker end"></span>` };    // 正解の選択肢
      for (let j = 1; j < 3; j++) {                         // 不正解の選択肢（３択の場合 j < 3）
        tempChoice[j] = { correct: false, html: `<span class="coordinate-checker start"></span>${choices[j]}<span class="coordinate-checker end"></span>` };
      }
      questions[i].choices = tempChoice;
    }

    return questions;
  }

  // 出題履歴に無いindex番号を返す関数
  function diffRandInt(max, histories) {
    // 無限ループ回避の早期リターン
    if (max < histories.length) {
      return false;
    }

    function checkDuplication(num) {
      for (let i = 0; i < histories.length; i++) {
        if (num === histories[i]) {
          return true;
        }
      }

      // ※※※以下のコードは不可！※※※
      // forEach内でreturnしても関数を抜けられない仕様らしい！
      /* histories.forEach(hist => {
          if (num === hist) {
            return true;
          }
       }); */
      return false;
    }

    let randInt = Math.floor(Math.random() * (max + 1));
    while (checkDuplication(randInt)) {
      randInt = Math.floor(Math.random() * (max + 1));
    }

    histories.push(randInt);  // qHistories配列を更新している
    return randInt;
  }

  // 配列の要素をシャッフルする関数
  function mixArrayElements(array) {
    let mixer = [];
    let sum;
    let product;

    while (sum !== 3 || product !== 0) {
      mixer = [];
      sum = 0;
      product = 0;
      for (let i = 0; i < 3; i++) {
        let randNum = Math.floor(Math.random() * 3);
        mixer.push(randNum);
      }
      sum = mixer[0] + mixer[1] + mixer[2];
      product = mixer[0] * mixer[1] * mixer[2];
    }

    const temp = [...array];
    let newArray = [];
    for (let i = 0; i < 3; i++) {
      newArray[i] = temp[mixer[i]]
    }

    return newArray;
  }

  // 変数の定義・初期化
  const questions = getQuestions();     // questions配列を作成
  let correctCounter = 0;               // 正答数カウンタ
  let progress = 0;                     // 進捗度カウンタ
  let qHistories = [];                  // 出題履歴の配列: 出題した問題を、questions配列のindex番号として控えておく
  let aHistories = [];                  // 回答履歴の配列
  let nOfQ = Number(localStorage.getItem('nOfQ'));  // number if questions: 出題数
  let currentPageNum = 0;
  let answered;
  let nOfChoices = 3;                   //選択肢の数

  // elementの取得
  // heading
  const spansInHeader = document.querySelectorAll('header span');
  const h2Heading = document.querySelector('h2 > span.num');
  const pCounter = document.querySelector('div.counter > p:last-child > span');
  // 問題文
  const h3Sentence = document.querySelector('h3.q-sentence');
  // 選択肢(list関係)
  const ulChoices = document.querySelector('div.choices>ul');
  const liChoices = document.querySelectorAll('div.choices li');
  const liFirstChoice = document.querySelector('li.first');
  const liSecondChoice = document.querySelector('li.second');
  const liThirdChoice = document.querySelector('li.third');
  const pFirstChoice = document.querySelector('li.first > p');
  const pSecondChoice = document.querySelector('li.second > p');
  const pThirdChoice = document.querySelector('li.third > p');
  // answer-wrapper内
  const divAnswerField = document.querySelector('div.answer-wrapper');
  const pInAnswerWrapper = document.querySelector('div.answer-wrapper > p');
  const h3CorrectAnswer = document.querySelector('h3.correct-answer');
  const divComment = document.querySelector('div.comment');
  const divMask = document.querySelector('div.mask');
  // ○×の画像
  const imgCorrect = document.querySelector('.img-correct');
  const imgWrong = document.querySelector('.img-wrong');
  // ボタン 
  const btnNext = document.querySelector('#btn-next');
  const btnPrev = document.querySelector('#btn-prev');
  const spanSeparater = document.querySelector('div#btn-wrapper > span');
  // その他
  const btnSetting = document.querySelector('button#btn-setting-icon');
  let rts;
  // let rts = document.querySelectorAll('rt');
  const kanaRadioOn = document.querySelector('#kana-radio-on');
  const kanaRadioOff = document.querySelector('#kana-radio-off');
  const legendKanaRadio = document.querySelector('#kana-radio');


  function resetPage() {
    // classをremove
    liChoices.forEach(li => {
      li.classList.remove('correct');
      li.classList.remove('answered');
      li.classList.remove('choiced');
    });
    h3CorrectAnswer.classList.remove('a-is-correct');
    h3CorrectAnswer.classList.remove('b-is-correct');
    h3CorrectAnswer.classList.remove('c-is-correct');

    divMask.classList.remove('reveal');
    h3CorrectAnswer.classList.add('erase');
    divComment.classList.add('erase');
    pInAnswerWrapper.classList.add('erase');
    divAnswerField.classList.remove('show');
    pCounter.classList.remove('count-up');

    // 〇✕画像の非表示
    imgCorrect.style.transform = 'scale(0, 0)';
    imgWrong.style.transform = 'scale(0, 0)';

    // ヘッダーの？の位置の変更
    spansInHeader.forEach(span => {
      span.textContent = '.';
    });
    spansInHeader.forEach((span, index) => {
      span.textContent = '.';
      const randInt = Math.floor(Math.random() * 6);
      if (index === randInt) {
        span.textContent = '?';
      }
    });

    // クリックイベントの削除: 削除しないと正解数カウントがフィボナッチで加算される。
    liFirstChoice.removeEventListener('click', firstClicked, false);
    liSecondChoice.removeEventListener('click', secondClicked, false);
    liThirdChoice.removeEventListener('click', thirdClicked, false);


  }

  function answeredPage(pageNumAfterTransition) {
    // 選択状況のリセット
    liChoices.forEach(li => {
      li.classList.remove('choiced');
      li.classList.add('answered');
    });
    h3CorrectAnswer.classList.remove('a-is-correct');
    h3CorrectAnswer.classList.remove('b-is-correct');
    h3CorrectAnswer.classList.remove('c-is-correct');
    h3CorrectAnswer.classList.remove('erase');
    divComment.classList.remove('erase');
    pInAnswerWrapper.classList.remove('erase');
    divMask.classList.add('reveal');
    divAnswerField.classList.add('show');
    if (currentPageNum === progress && !answered) {       // 現頁がフロンティアで未回答
      divMask.classList.add('fast-reveal');
    }

    const answerHistory = aHistories[pageNumAfterTransition - 1];
    let oldQuestion = questions.filter((question) => question.id === answerHistory.id); // oldQuestion = [{oldQuestion}]
    oldQuestion = oldQuestion[0];

    h2Heading.textContent = pageNumAfterTransition;
    h3Sentence.innerHTML = `<span class="coordinate-checker start"></span>${oldQuestion.question}<span class="coordinate-checker end"></span>`;
    pFirstChoice.innerHTML = answerHistory.choices[0].html;
    pSecondChoice.innerHTML = answerHistory.choices[1].html;
    pThirdChoice.innerHTML = answerHistory.choices[2].html;
    divComment.innerHTML = oldQuestion.commentHtml;

    switch (answerHistory.choiced) {
      case 0:
        liFirstChoice.classList.add('choiced');
        break;
      case 1:
        liSecondChoice.classList.add('choiced');
        break;
      case 2:
        liThirdChoice.classList.add('choiced');
        break;
    }

    if (answerHistory.choices[0].correct) {
      h3CorrectAnswer.textContent = 'A';
      h3CorrectAnswer.classList.add('a-is-correct');
    }
    if (answerHistory.choices[1].correct) {
      h3CorrectAnswer.textContent = 'B';
      h3CorrectAnswer.classList.add('b-is-correct');
    }
    if (answerHistory.choices[2].correct) {
      h3CorrectAnswer.textContent = 'C';
      h3CorrectAnswer.classList.add('c-is-correct');
    }

    if (answerHistory.correct) {
      imgCorrect.style.transform = 'scale(1, 1)';
      imgWrong.style.transform = 'scale(0, 0)';
    }
    if (!answerHistory.correct) {
      imgCorrect.style.transform = 'scale(0, 0)';
      imgWrong.style.transform = 'scale(1, 1)';
    }

    if (pageNumAfterTransition === 1) {
      btnPrev.classList.add('disabled');
    } else {
      btnPrev.classList.remove('disabled');
    }
    btnNext.classList.remove('disabled');
  }

  const p = document.querySelector('div.comment > p');

  function recreateCurrentPage(pageNumAfterTransition) {
    // 選択状況のリセット
    liChoices.forEach(li => {
      li.classList.remove('choiced');
    });
    h3CorrectAnswer.classList.remove('a-is-correct');
    h3CorrectAnswer.classList.remove('b-is-correct');
    h3CorrectAnswer.classList.remove('c-is-correct');
    divMask.classList.remove('fast-reveal');
    const answerHistory = aHistories[pageNumAfterTransition - 1];
    let oldQuestion = questions.filter((question) => question.id === answerHistory.id); // oldQuestion = [{oldQuestion}]
    oldQuestion = oldQuestion[0];

    h2Heading.textContent = pageNumAfterTransition;
    h3Sentence.innerHTML = `<span class="coordinate-checker start"></span>${oldQuestion.question}<span class="coordinate-checker end"></span>`;
    pFirstChoice.innerHTML = answerHistory.choices[0].html;
    pSecondChoice.innerHTML = answerHistory.choices[1].html;
    pThirdChoice.innerHTML = answerHistory.choices[2].html;
    divComment.innerHTML = oldQuestion.commentHtml;
    divMask.classList.remove('reveal');
    h3CorrectAnswer.classList.add('erase');
    divComment.classList.add('erase');
    pInAnswerWrapper.classList.add('erase');
    divAnswerField.classList.remove('show');

    liChoices.forEach(li => {
      li.classList.remove('answered');
    });
    switch (answerHistory.choiced) {
      case 0:
        liFirstChoice.classList.remove('choiced');
        break;
      case 1:
        liSecondChoice.classList.remove('choiced');
        break;
      case 2:
        liThirdChoice.classList.remove('choiced');
        break;
    }

    if (answerHistory.choices[0].correct) {
      h3CorrectAnswer.textContent = 'A';
      h3CorrectAnswer.classList.add('a-is-correct');
    }
    if (answerHistory.choices[1].correct) {
      h3CorrectAnswer.textContent = 'B';
      h3CorrectAnswer.classList.add('b-is-correct');
    }
    if (answerHistory.choices[2].correct) {
      h3CorrectAnswer.textContent = 'C';
      h3CorrectAnswer.classList.add('c-is-correct');
    }

    btnNext.classList.add('disabled');
    btnPrev.classList.remove('disabled');
    imgCorrect.style.transform = 'scale(0, 0)';
    imgWrong.style.transform = 'scale(0, 0)';

  }

  function createNewPage() {
    // 進捗度を1進める
    progress++;

    let qNum = diffRandInt(questions.length - 1, qHistories);
    // if (!qNum && typeof(qNum) === 'boolean') {
    //   alert('これ以上出題はありません。');
    //   return false;
    // }

    const mixedChoices = mixArrayElements(questions[qNum].choices);
    h2Heading.textContent = progress;
    h3Sentence.innerHTML = `<span class="coordinate-checker start"></span>${questions[qNum].question}<span class="coordinate-checker end"></span>`;
    pFirstChoice.innerHTML = mixedChoices[0].html;
    pSecondChoice.innerHTML = mixedChoices[1].html;
    pThirdChoice.innerHTML = mixedChoices[2].html;
    divComment.innerHTML = questions[qNum].commentHtml;

    mixedChoices.forEach((choice, i) => {
      if (choice.correct) {
        liChoices[i].classList.add('correct');
        switch (i) {
          case 0:
            h3CorrectAnswer.textContent = 'A';
            h3CorrectAnswer.classList.add('a-is-correct');
            break;
          case 1:
            h3CorrectAnswer.textContent = 'B';
            h3CorrectAnswer.classList.add('b-is-correct');
            break;
          case 2:
            h3CorrectAnswer.textContent = 'C';
            h3CorrectAnswer.classList.add('c-is-correct');
            break;
        }
      }
    });

    // 進捗度に応じてボタンの設定
    if (progress === 1) {
      btnPrev.classList.add('disabled');
    } else {
      btnPrev.classList.remove('disabled');
    }
    btnNext.classList.add('disabled');

    // クリックイベントの追加
    liFirstChoice.addEventListener('click', firstClicked);
    liSecondChoice.addEventListener('click', secondClicked);
    liThirdChoice.addEventListener('click', thirdClicked);

    // answerHistoryの更新
    aHistories.push({});
    aHistories[progress - 1].id = questions[qNum].id;
    aHistories[progress - 1].question = questions[qNum].question;
    let tempChoices = [];
    for (let i = 0; i < 3; i++) {                                                           //3択のみ対応
      tempChoices.push({ correct: null, html: null });
      tempChoices[i].correct = mixedChoices[i].correct;
      tempChoices[i].html = mixedChoices[i].html;
    }
    aHistories[progress - 1].choices = tempChoices;

    // console.log(liFirstChoice.querySelector('p'));
    // console.log(hasLineBreak(liFirstChoice.querySelector('p')));
    // console.log('---------------------------------------------------');
    // console.log(liSecondChoice.querySelector('p'));
    // console.log(hasLineBreak(liSecondChoice.querySelector('p')));
    // console.log('---------------------------------------------------');
    // console.log(liThirdChoice.querySelector('p'));
    // console.log(hasLineBreak(liThirdChoice.querySelector('p')));
    // console.log('---------------------------------------------------');

  }

  function liClicked(listElement) {
    h3CorrectAnswer.classList.remove('erase');
    divComment.classList.remove('erase');
    pInAnswerWrapper.classList.remove('erase');
    divAnswerField.classList.add('show');
    btnNext.classList.remove('disabled');
    listElement.classList.add('choiced');
    divMask.classList.add('reveal');

    liChoices.forEach(li => {
      li.classList.add('answered');
    });

    if (listElement.classList.contains('correct')) {
      console.log('correct!');
      imgCorrect.style.transform = 'scale(.6, .6)';
      correctCounter++;
      setTimeout(() => {
        pCounter.textContent = correctCounter;
        pCounter.classList.add('count-up');
      }, 1800);
      aHistories[progress - 1].correct = true;
    }
    if (!listElement.classList.contains('correct')) {
      console.log('wrong...');
      imgWrong.style.transform = 'scale(.6, .6)';
      aHistories[progress - 1].correct = false;
    }
  }
  function firstClicked() {
    aHistories[progress - 1].choiced = 0;
    liClicked(liFirstChoice);
  }
  function secondClicked() {
    aHistories[progress - 1].choiced = 1;
    liClicked(liSecondChoice);
  }
  function thirdClicked() {
    aHistories[progress - 1].choiced = 2;
    liClicked(liThirdChoice);
  }


  // 以上関数定義部分


  // 以下実行部分


  // 現在地の取得
  let now = window.location.href.split('/').pop();

  if (now === 'quize.html') {
    resetPage();
    createNewPage();
    // let rts = document.querySelectorAll('rt');
    turnOffKana();
    restyleChoices();


    btnNext.addEventListener('click', (e) => {
      currentPageNum = Number(h2Heading.textContent);
      answered = aHistories[progress - 1].hasOwnProperty('choiced');
      function rewriteBtnNext(e) {
        e.preventDefault(); // jsからhrefを変更するとその瞬間に画面遷移するので、それを回避
        btnNext.href = 'result.html';
        btnNext.textContent = '成績画面へ /&gt;';
      }

      // 最終ページ以外
      if (!(currentPageNum === nOfQ)) {

        if (currentPageNum === nOfQ - 1) {
          rewriteBtnNext(e);
        }

        if (currentPageNum === progress) {                          // 次頁が未作成(aHistoriesにログも無い)
          resetPage();
          createNewPage();
          toggleKana();
          restyleChoices();
        } else if (currentPageNum + 1 === progress && answered) {   // 次頁がフロンティアで回答済み
          answeredPage(currentPageNum + 1);
          toggleKana();

          restyleChoices();

        } else if (currentPageNum + 1 === progress && !answered) {   // 次頁がフロンティアで未回答
          recreateCurrentPage(progress);
          toggleKana();

          restyleChoices();

        } else {
          answeredPage(currentPageNum + 1);
          toggleKana();

          restyleChoices();
        }

      }

      // 最終ページ
      if (currentPageNum === nOfQ) {
        const test = ['test1', 'test2', { test3: 1997 }];
        console.log(aHistories);
        localStorage.setItem('key', JSON.stringify(aHistories));
      }

    });

    btnPrev.addEventListener('click', () => {
      currentPageNum = Number(h2Heading.textContent);
      answered = aHistories[progress - 1].hasOwnProperty('choiced');
      answeredPage(currentPageNum - 1);
      toggleKana();

      restyleChoices();
      btnNext.href = '#';
      btnNext.textContent = '次へ ▶';
    });

    btnSetting.addEventListener('click', (e) => {
      e.preventDefault();
      document.querySelector('section.setting-wrapper').classList.toggle('slide');
      document.querySelector('main').classList.toggle('slide');
      document.querySelector('header').classList.toggle('slide');
      document.querySelector('div#btn-wrapper').classList.toggle('slide');
      btnSetting.classList.toggle('clicked');
      btnSetting.querySelector('span').classList.toggle('open');
      btnSetting.querySelector('span').classList.toggle('close');
      if (btnSetting.querySelector('span').classList.contains('close')){
        btnSetting.querySelector('span').textContent = 'arrow_forward_ios';
      }
      if (btnSetting.querySelector('span').classList.contains('open')){
        btnSetting.querySelector('span').textContent = 'more_horiz';
      }
      btnSetting.querySelector('span').classList.add('clicked');
      setTimeout(() => {
        btnSetting.querySelector('span').classList.remove('clicked');
      }, 1200);
      setTimeout(() => {
        toggleKana();
        restyleChoices();
      }, 500)
    });

    legendKanaRadio.addEventListener('click', () => {
      const liKanaMenu = legendKanaRadio.parentElement.parentElement;
      liKanaMenu.classList.toggle('appear');
    });



    window.addEventListener('resize', restyleChoices);

    function turnOnKana() {
      rts = document.querySelectorAll('rt');
      rts.forEach(rt => {
        rt.style.display = 'block';
      });
    }
    function turnOffKana() {
      rts = document.querySelectorAll('rt');
      rts.forEach(rt => {
        rt.style.display = 'none';
      });
    }
    function toggleKana() {
      console.log('excuted toggleKana');
      if (kanaRadioOn.checked) {
        turnOnKana();
      }
      if (kanaRadioOff.checked) {
        turnOffKana();
      }
    }
    kanaRadioOn.addEventListener('change', toggleKana);
    kanaRadioOff.addEventListener('change', toggleKana);


  }

  function hasLineBreak(limit) {
    for (let i = 0; i < nOfChoices; i++) {
      const pInli = liChoices[i].querySelector('p');
      if (getNumOfLines(pInli) >= limit) {
        return true;
      }
    }
    return false;
  }

  function restyleChoices() {

    h3Sentence.parentElement.style.height = `${getNumOfLines(h3Sentence) * 20 * 1.85}px`;

    liChoices.forEach(choice => {
      const pInli = choice.querySelector('p');
      pInli.style.textAlign = 'center';
    });
    ulChoices.style.flexDirection = 'row';
    ulChoices.style.gap = '2em';
    if (hasLineBreak(3) || window.innerWidth < 600) {
      ulChoices.style.flexDirection = 'column';
      ulChoices.style.gap = '1em';
      liChoices.forEach(choice => {
        const pInli = choice.querySelector('p');
        pInli.style.textAlign = 'left';
      });
    } else if (hasLineBreak(2)) {
      liChoices.forEach(choice => {
        const pInli = choice.querySelector('p');
        switch (getNumOfLines(pInli)) {
          case 1:
            break;
          case 2:
            pInli.style.textAlign = 'left';
        }
      });
    }
  }



  // ホームのページ
  if (now === 'index.html') {

  }

  if (now === 'result.html') {
    // const getTest = localStorage.getItem('key');
    // console.log(JSON.parse(getTest));
  }


}