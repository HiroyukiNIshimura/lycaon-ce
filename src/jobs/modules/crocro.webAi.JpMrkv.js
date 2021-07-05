/*	Web AI <http://crocro.com/write/web_ai/wiki.cgi>
	is released under the MIT License <http://www.opensource.org/licenses/mit-license.php>
	in a Japanese translation <http://sourceforge.jp/projects/opensource/wiki/licenses%2FMIT_license>
	Copyright (c) 2010 Masakazu Yanai / (c) 2010 Cronus Crown <webmaster@crocro.com>
*/

module.exports = {
  /**
   *	@variable	crocro.webAi.JpMrkv(arg)
   *	@title	日本語マルコフ連鎖
   *	@description
   *
   *		日本語の文章から、マルコフ連鎖を行うオブジェクト。
   *		newで初期化してから利用する。
   *
   *		引数は連想配列で設定する。例）{～: "～", …}
   *
   *	@param	arg.ndMax		文章の最大ノード。
   *	@param	arg.chain		接頭文字数（デフォルトは1。2以上の場合は、似たような文章が大量に必要）。
   *	@param	arg.bsSntncLen	基本文章長。
   */
  JpMrkv: function (arg) {
    // ユーザー変数
    /**
     *	@variable	JpMrkv.ndMax
     *	@title	文章の最大ノード
     *	@description
     *		生成する文章の長さを規定する。長さの単位はノード。何ノードまでの連結を許すか。
     *
     *		デフォルトは「300」。
     */
    /**
     *	@variable	JpMrkv.chain
     *	@title	接頭文字数
     *	@description
     *		ノード連結単位。1の場合は、前後の繋がりだけを見る。
     *		2以上の場合は、2つ前、3つ前の繋がりも見て確認する。
     *
     *		デフォルトは「1」。「2」以上の場合は、似たような文章が大量に必要になる。
     */
    /**
     *	@variable	JpMrkv.bsSntncLen
     *	@title	基本文章長
     *	@description
     *		だいたい、この文字数になるように連結を目指す値。
     *
     *		デフォルトは「25」。
     */
    this.ndMax = 300; // 文章の最大ノード
    this.chain = 1; // 接頭文字数（デフォルトは1。2以上の場合は、似たような文章が大量に必要）
    this.bsSntncLen = 25; // 基本文章長

    // ユーザー変数の設定
    if (arg) {
      if ('ndMax' in arg) {
        this.ndMax = arg.ndMax;
      }
      if ('chain' in arg) {
        this.chain = arg.chain;
      }
      if ('bsSntncLen' in arg) {
        this.bsSntncLen = arg.bsSntncLen;
      }
    }

    // 内部利用変数
    this.dic = {}; // 辞書
    this.dbgStr = ''; // デバッグ用文字列

    // 日本語分割用正規表現
    /**
     *	@variable	JpMrkv.bsRe
     *	@title	日本語分割用正規表現
     *	@description
     *		日本語の文章をノードに分解するための正規表現。
     *		この値を差し替えると、違う分割でマルコフ連鎖を行える。
     */
    this.bsRe = new RegExp(
      '' +
        '「.+?」|『.+?』|（.+?）|\\(.+?\\)|' +
        '[ァ-ヶ・＝ー０-９0-9一-龠Ａ-Ｚａ-ｚ０-９\\w\\-]{2,}|' +
        '[一-龠々〆ヵヶ]+、{0,1}|[ぁ-ん]+、{0,1}|[ァ-ヴー]+、{0,1}|' +
        '[a-zA-Z0-9]+、{0,1}|[ａ-ｚＡ-Ｚ０-９]+、{0,1}|' +
        '[、。！!？?()（）「」『』]{1}',
      'g'
    );

    // キー内の位置
    var KEY_STR = 0; // 文字列
    var KEY_POS = 1; // 位置
    var KEY_LEN = 2; // 全体サイズ

    /*
     *--------------------------------------------------
     */

    /**
     *	@access	private
     *	@variable	JpMrkv.Rndm(dbgSeed_)
     *	@title	ランダム
     *	@description
     *
     *		ランダムな値を取得するためのオブジェクト。
     *		デバッグ・シードでのランダムは、デバッグ用途なので精度は悪い。
     *
     *	@param	dbgSeed_	デバッグ・シードを利用するか。
     *						指定なしか-1の時は通常のランダム。
     *	@return	ランダムな値。
     */
    function Rndm(dbgSeed_) {
      var dbgSeed = dbgSeed_ || -1;
      var nowKey = 2 * 3 * 5 * 7 * 11 * 13 * 17 - 1 - dbgSeed;

      /**
       *	@access	private
       *	@variable	JpMrkv.Rndm.nextInt(strt, max)
       *	@title	数値取得
       *	@description
       *
       *		ランダムな値を取得する。
       *
       *	@param	strt	開始数値。
       *	@param	strt	最大数値（この値未満となる）。
       *	@return	ランダムな値。
       */
      this.nextInt = function (strt, max) {
        var res = 0;
        var rng = max - strt;
        if (dbgSeed === -1) {
          res = strt + Math.floor(Math.random() * rng); // 通常
        } else {
          nowKey = nowKey * 1103515245 + 12345;
          if (nowKey < 0) {
            nowKey /= 2;
            nowKey *= -1;
          }
          nowKey = nowKey & 2147483647;
          res = strt + (nowKey % rng); // デバッグ・シード
        }
        return res;
      };
    }

    /*
     *--------------------------------------------------
     */

    /**
     *	@variable	JpMrkv.reset(arg)
     *	@title	リセット
     *	@description
     *
     *		内容をリセットしてメモリを解放する。
     *		設定はそのまま維持する。
     *
     *	@return	なし。
     */
    this.reset = function () {
      this.dic = {}; // 辞書
      this.dbgStr = ''; // デバッグ用文字列
    };

    /**
     *	@variable	JpMrkv.setSntncArr(srcArr)
     *	@title	文章の登録
     *	@description
     *
     *		文章の配列を引数として、マルコフ連鎖用の文章を登録する。
     *
     *	@param	srcArr		元になる文章配列を指定。
     *	@return	なし。
     */
    this.setSntncArr = function (srcArr) {
      for (var i = 0; i < srcArr.length; i++) {
        this.addSntnc(srcArr[i]);
      }
    };

    /**
     *	@variable	JpMrkv.addSntnc(srcStr)
     *	@title	文章の登録
     *	@description
     *
     *		通常は内部で使用する、文章追加メソッド。
     *
     *	@param	srcStrr		元になる文章を指定。
     *	@return	なし。
     */
    this.addSntnc = function (srcStr) {
      var strArr = srcStr.match(this.bsRe);
      if (!strArr) {
        return;
      }

      // 追加可能文章か判定
      if (!srcStr.match('[るただいす。]$')) {
        return;
      }

      // デバッグ用
      //this.dbgStr += srcStr + "<BR>[" + strArr + "]<BR><BR>";

      strArr.unshift('_START_'); // 先頭

      // n接頭文字1接尾文字
      var n = this.chain; // 接頭文字の数

      // 末尾の追加
      for (let i = 0; i < n; i++) {
        strArr.push('_END_');
      }

      for (let i = 0; i < strArr.length; i++) {
        if (strArr[i] === '0') {
          strArr[i] = '&#x30;';
        } // ハッシュに使えない添え字対策
      }

      var strArrLen = strArr.length;
      var strArrPos = 0;

      while (strArr[n]) {
        // 文字列配列が残っている間実行
        if (!this.dic[strArr[0]]) {
          this.dic[strArr[0]] = new Array();
        }

        var pntr = this.dic[strArr[0]]; // 配列のポインタ

        if (n > 1) {
          for (var i = 1; i <= n; i++) {
            // キー配列の追加
            if (!pntr['_KEY_']) {
              pntr['_KEY_'] = [];
            } // キー配列の作製
            var keyArr = new Array();
            keyArr[KEY_STR] = strArr[i]; // 文字列
            keyArr[KEY_POS] = strArrPos; // 位置
            keyArr[KEY_LEN] = strArrLen; // 全体サイズ
            pntr['_KEY_'].push(keyArr);
            strArrPos++;

            // ツリーの追加

            if (!pntr[strArr[i]]) {
              pntr[strArr[i]] = [];
            } // ツリーの作製
            pntr[strArr[i]].push(strArr[i + 1]);

            pntr = pntr[strArr[i]];
          }
        } else {
          pntr.push(strArr[1]);
        }

        strArr.shift(); // 先頭を削除
      }
    };

    /*
     *--------------------------------------------------
     */
    /*
     *--------------------------------------------------
     */

    /**
     *	@variable	JpMrkv.getSntnc(arg)
     *	@title	マルコフ連鎖の実行
     *	@description
     *
     *		ランダム・キーと、開始に使用したい文字列で、マルコフ連鎖を実行する。
     *
     *	@param	arg.rndKey		ランダムのデバッグ・シード・キー。-1の場合は通常のランダム。
     *	@param	arg.strtStr		開始に使用する文字列。「""」の場合は先頭文字からランダムで決定。
     *	@return	作成した文章。
     */
    this.getSntnc = function (arg) {
      // 変数の初期化
      var rndKey = -1;
      var strtStr_ = '';

      if (arg) {
        if ('rndKey' in arg) {
          rndKey = arg.rndKey;
        }
        if ('strtStr' in arg) {
          strtStr_ = arg.strtStr;
        }
      }

      // 変数の初期化
      var sntnc = '';
      var sntCnt = 0; // センテンスの長さ
      var rndm = new Rndm(rndKey); // シード付きランダム
      var strtStr = '_START_';
      if (strtStr_ !== '' && this.dic[strtStr]) {
        strtStr = strtStr_;
        sntnc += strtStr_;
      }

      // n接頭文字1接尾文字
      if (this.dic[strtStr]) {
        // 接頭文字の数
        var n = this.chain;
        var w = new Array();
        var pntr;

        // 最初の連鎖の初期化
        pntr = this.dic[strtStr];
        if (pntr['_KEY_']) {
          w[0] = getRndFrmKeyPntr(pntr, rndm, 0);
        } else {
          w[0] = getRndFrmPntr(pntr, rndm);
        }

        sntnc += w[0];
        sntCnt++;

        for (let j = 1; j < n; j++) {
          pntr = pntr[w[j - 1]];
          if (pntr['_KEY_']) {
            w[j] = getRndFrmKeyPntr(pntr, rndm, j);
          } else {
            w[j] = getRndFrmPntr(pntr, rndm);
          }
        }

        // 連鎖で結合
        for (var i = 0; i <= this.ndMax; i++) {
          // 文章の連結
          if (w[1] === '_END_') {
            break;
          } // 末尾なので終了
          if (w[1]) {
            sntnc += w[1]; // 1接頭文字対策
            sntCnt++;
          }

          pntr = this.dic[w[0]];

          if (n > 1) {
            let j = 1;
            for (; j < n; j++) {
              pntr = pntr[w[j]];
            }
            if (pntr['_KEY_']) {
              w[j] = getRndFrmKeyPntr(pntr, rndm, sntCnt + j);
            } else {
              w[j] = getRndFrmPntr(pntr, rndm);
            }
          } else {
            w[1] = getRndFrmPntr(pntr, rndm);
          }

          // 次の位置にスライド
          for (var j = 0; j < n; j++) {
            w[j] = w[j + 1];
          }
        }
      }

      // 短すぎるセンテンスは無効
      if (sntCnt <= 2) {
        return '';
      }

      // 戻り値を戻して終了
      return sntnc;
    };

    /**
     *	@access	private
     *	@variable	getRndFrmPntr(pntr, rndm)
     *	@title	ポインタからランダム取得
     *	@description
     *
     *		ポインタから、連鎖のツリーをランダムで取得。
     *
     *	@param	pntr	ランダムのデバッグ・シード・キー。-1の場合は通常のランダム。
     *	@param	rndm	開始に使用する文字列。「""」の場合は先頭文字からランダムで決定。
     *	@return	文字列。
     */
    function getRndFrmPntr(pntr, rndm) {
      var w = pntr[rndm.nextInt(0, pntr.length)];
      return w;
    }

    /**
     *	@access	private
     *	@variable	JpMrkv.getRndFrmKeyPntr(pntr, rndm, sntPos)
     *	@title	キー・ポインタからランダム取得
     *	@description
     *
     *		ポインタから、連鎖のツリーをランダムで取得。
     *		文章中の、どの辺りにある単語かで、優先順位を変える。
     *
     *	@param	pntr	ランダムのデバッグ・シード・キー。-1の場合は通常のランダム。
     *	@param	rndm	開始に使用する文字列。「""」の場合は先頭文字からランダムで決定。
     *	@param	sntPos	文章内での位置。
     *	@return	文字列。
     */
    function getRndFrmKeyPntr(pntr, rndm, sntPos) {
      var keyArr = pntr['_KEY_'];
      var newArr = new Array();
      for (var i = 0; i < keyArr.length; i++) {
        // 文章中の、どの辺りにある単語かで、優先順位を変える。
        var bsPer = Math.min((sntPos / this.bsSntncLen) * 100, 100);
        var dtPer = Math.min((keyArr[i][KEY_POS] / keyArr[i][KEY_LEN]) * 100, 100);
        var dst = (dtPer - bsPer) / 10;
        if (dst < 0) {
          dst = dst * -1;
        }
        var len = Math.max(1, 10 - dst); // 大きい方を取得

        for (var j = 0; j < len; j++) {
          newArr.push(keyArr[i][KEY_STR]);
        }
      }
      var w = newArr[rndm.nextInt(0, newArr.length)];
      return w;
    }
  },
};
