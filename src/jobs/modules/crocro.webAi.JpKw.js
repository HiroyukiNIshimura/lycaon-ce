/*	Web AI <http://crocro.com/write/web_ai/wiki.cgi>
	is released under the MIT License <http://www.opensource.org/licenses/mit-license.php>
	in a Japanese translation <http://sourceforge.jp/projects/opensource/wiki/licenses%2FMIT_license>
	Copyright (c) 2010 Masakazu Yanai / (c) 2010 Cronus Crown <webmaster@crocro.com>
*/

module.exports = {
  /**
   *	@variable	crocro.webAi.JpKw(arg)
   *	@title	日本語キーワード
   *	@description
   *
   *		Webから取得した雑多な日本語から、キーワードを抽出するオブジェクト。
   *		newで初期化してから利用する。
   *
   *		引数は連想配列で設定する。例）{～: "～", …}
   *
   *	@param	arg.avoidStr	無視文字列（,単語1,単語2,...,）
   *	@param	arg.bsUrl		基準URL
   *	@param	arg.outMax		描画キーワード最大数
   *	@param	arg.kwLenMin	キーワード文字数最小値
   *	@param	arg.kwLenMid	キーワード文字数中央値
   */
  JpKw: function (arg) {
    // ユーザー変数
    /**
     *	@variable	JpKw.avoidStr
     *	@title	無視文字列
     *	@description
     *		無視文字列（単語1,単語2,...）。
     *
     *		デフォルトは空文字。
     */
    /**
     *	@variable	JpKw.bsUrl
     *	@title	基準URL
     *	@description
     *		HTML化出力時の基準URL。
     *
     *		デフォルトは「?q=」。
     */
    /**
     *	@variable	JpKw.outMax
     *	@title	描画キーワード最大数
     *	@description
     *		出力時の最大キーワード数。
     *
     *		デフォルトは「20」。
     */
    this.avoidStr = ''; // 無視文字列（単語1,単語2,...）
    this.bsUrl = '?q='; // 基準URL
    this.outMax = 20; // 描画キーワード最大数

    // キーワード抽出時の設定
    /**
     *	@variable	JpKw.kwLenMin
     *	@title	キーワード文字数最小値
     *	@description
     *		キーワードとして認識する文字数の最小値。
     *
     *		デフォルトは「2」。
     */
    /**
     *	@variable	JpKw.kwLenMid
     *	@title	キーワード文字数中央値
     *	@description
     *		キーワードの標準的な文字長を規定する。
     *
     *		デフォルトは「4」。
     */
    this.kwLenMin = 2; // キーワード文字数最小値
    this.kwLenMid = 4; // キーワード文字数中央値

    // ユーザー変数の設定
    if (arg) {
      if ('avoidStr' in arg) {
        this.avoidStr = arg.avoidStr;
      }
      if ('bsUrl' in arg) {
        this.bsUrl = arg.bsUrl;
      }
      if ('outMax' in arg) {
        this.outMax = arg.outMax;
      }
      if ('kwLenMin' in arg) {
        this.kwLenMin = arg.kwLenMin;
      }
      if ('kwLenMid' in arg) {
        this.kwLenMid = arg.kwLenMid;
      }
    }

    // 内部利用変数
    this.srcStr = ''; // キーワード収集対象文字列

    // 配列位置変数
    var CNT = 0; // 回数
    var KW = 1; // キーワード
    var PNT = 2; // 点数

    // 無視文字列用点数
    var AVOID_PNT = -999999;

    /*
     *--------------------------------------------------
     */

    /**
     *	@variable	JpKw.reset()
     *	@title	リセット
     *	@description
     *
     *		内容をリセットしてメモリを解放する。
     *		設定はそのまま維持する。
     *
     *	@return	なし
     */
    this.reset = function () {
      this.srcStr = '';
    };

    /**
     *	@variable	JpKw.addSrc(str)
     *	@title	入力文字列の追加
     *	@description
     *
     *		キーワード抽出用の入力文字列を追加する。
     *		文字列は半角スペースで連結する。
     *
     *	@param	str		追加する文字列。
     *	@return	なし
     */
    this.addSrc = function (str) {
      this.srcStr += ' ' + str;
    };

    /**
     *	@variable	JpKw.getKwArr()
     *	@title	キーワード配列の取得
     *	@description
     *
     *		入力した文字列を元に、キーワード配列を作成する。
     *
     *	@return	キーワード配列
     */
    this.getKwArr = function () {
      return this.getKeyWord(this.srcStr);
    };

    /**
     *	@variable	JpKw.getStrArr(arg)
     *	@title	キーワード配列を文字列配列に変換して取得
     *	@description
     *
     *		入力した文字列を元に、キーワード配列を作成する。
     *
     *	@param	arg.prmAll		値を全て戻すか。falseなら文字列のみを戻す。
     *							デフォルトはfalse。
     *	@return	文字列配列
     */
    this.getStrArr = function (arg) {
      // 引数の展開
      var prmAll = false;
      if (arg) {
        if ('prmAll' in arg) {
          prmAll = arg.prmAll;
        }
      }

      // 配列の取得
      var kwArr = this.getKeyWord(this.srcStr);
      var resArr = this.kwArrToStrArr(kwArr, prmAll);
      return resArr;
    };

    /**
     *	@variable	JpKw.kwArrToStrArr(kwArr, prmAll)
     *	@title	キーワード配列を文字列配列に変換
     *	@description
     *
     *		入力した文字列を元に、キーワード配列を作成する。
     *
     *	@param	kwArr	キーワード配列。
     *	@param	prmAll	値を全て戻すか（trueかfalse）。falseなら文字列のみを戻す。
     *	@return	文字列配列
     */
    this.kwArrToStrArr = function (kwArr, prmAll) {
      var strArr = [];
      if (!kwArr || !(kwArr instanceof Array)) {
        return strArr;
      }
      for (var i = 0; i < kwArr.length; i++) {
        if (!prmAll) {
          strArr.push(kwArr[i][KW]);
        } else {
          strArr.push(kwArr[i].join('/'));
        }
      }
      return strArr;
    };

    /*
     *--------------------------------------------------
     */

    /*
     *--------------------------------------------------
     */

    /**
     *	@variable	JpKw.getKeyWord(srcStr)
     *	@title	キーワードの取得
     *	@description
     *
     *		日本語文字列から、キーワードを抽出する。
     *
     *	@param	srcStr	入力文字列。
     *	@return	なし
     */
    this.getKeyWord = function (srcStr) {
      // 変数の初期化
      let tmpArr;
      var wrdArr = new Array();
      var resArr = null;
      var resArrSz = 0;

      // 片仮名のみ2個以上か、漢字のみか、アルファベットと数字のみ2個以上か
      let re = new RegExp('[ァ-ヶ・＝ー０-９0-9一-龠々Ａ-Ｚａ-ｚ０-９\\w\\-]{2,}|[一-龠々]+', 'ig');

      /*
       *--------------------------------------------------
       */

      // 評価ポイント計算用変数の初期化

      // 漢字ブロック検出
      var chkKnPrm = 1;
      var chkKnArr;
      var chkKnRe = new RegExp('[一-龠々]{1,}', 'ig');
      // 片仮名文字数
      var chkKtPrm = 0;
      var chkKtArr;
      var chkKtRe = new RegExp('[ァ-ヶ・＝ー]{1,1}', 'ig');
      // 数字
      var chkNoPrm = 0;
      var chkNoArr;
      var chkNoRe = new RegExp('[０-９0-9]{1,}', 'ig');
      // 英文字
      var chkEnPrm = 0;
      var chkEnArr;
      var chkEnRe = new RegExp('[Ａ-Ｚａ-ｚA-Za-z]{1,}', 'ig');
      // ドット
      var chkDtPrm = 0;
      var chkDtArr;
      var chkDtRe = new RegExp('・', 'ig');

      /*
       *--------------------------------------------------
       */

      // 文字列の配列化
      tmpArr = srcStr.match(re);
      if (!tmpArr) {
        return resArr;
      }
      for (var i = 1; i < tmpArr.length; i++) {
        if (tmpArr[i].length <= this.kwLenMin) {
          continue;
        }
        wrdArr.push(tmpArr[i]);
      }
      if (wrdArr.length > 0) {
        resArr = new Array(0); // 0 - 回数、1 - キーワード、2 - 点数

        wrdArr = wrdArr.sort();
        resArr[0] = new Array(2);
        resArr[0][CNT] = 1;
        resArr[0][KW] = wrdArr[0];
        resArrSz++;
        for (let i = 1; i < wrdArr.length; i++) {
          if (wrdArr[i] === resArr[resArrSz - 1][KW]) {
            // 一致
            resArr[resArrSz - 1][CNT]++;
          } else {
            // 不一致
            resArr[resArrSz] = new Array(2);
            resArr[resArrSz][CNT] = 1;
            resArr[resArrSz][KW] = wrdArr[i];
            resArrSz++;
          }
        }

        // 評価ポイント順にソート
        for (let i = 0; i < resArrSz; i++) {
          // 漢字ブロック検出
          chkKnPrm = 1;
          chkKnArr = resArr[i][KW].match(chkKnRe);
          if (chkKnArr && chkKnArr.length > 0 && chkKnArr[0].length !== resArr[i][1].length) {
            chkKnPrm = 4;
          }

          // 片仮名文字数
          chkKtPrm = 0;
          chkKtArr = resArr[i][KW].match(chkKtRe);
          if (chkKtArr && chkKtArr.length > 0) {
            chkKtPrm = chkKtArr.length;
          }

          // 数字
          chkNoPrm = 0;
          chkNoArr = resArr[i][KW].match(chkNoRe);
          if (chkNoArr && chkNoArr.length > 0) {
            chkNoPrm = chkNoArr[0].length;
          }

          // 英文字
          chkEnPrm = 0;
          chkEnArr = resArr[i][KW].match(chkEnRe);
          if (chkEnArr && chkEnArr.length > 0) {
            chkEnPrm = chkEnArr[0].length;
          }

          // ドット
          chkDtPrm = 0;
          chkDtArr = resArr[i][KW].match(chkDtRe);
          if (chkDtArr && chkDtArr.length > 0) {
            chkDtPrm = chkDtArr[0].length;
          }

          // 評価ポイント計算
          resArr[i][PNT] = Math.ceil(
            (resArr[i][CNT] *
              0.5 * // 個数 = 0.5point
              10) /
              (1 + Math.abs(resArr[i][KW].length - this.kwLenMid)) - // 文字数 - 中央値
              chkKtPrm * 0.5 - // 片仮名一文字 = -0.5point
              chkNoPrm * 50 - // 数字   = -50point
              chkDtPrm * 50 + // ドット = -50point
              chkEnPrm * 0.5 // 英文字 = +0.5point
          );

          resArr[i][PNT] = resArr[i][PNT] * chkKnPrm; // 漢字を含む複合語 = 4.0倍
          let re = new RegExp(',' + resArr[i][1] + ',', 'i');
          if ((',' + this.avoidStr + ',').match(re)) {
            resArr[i][PNT] = AVOID_PNT;
          } // 無視文字列
        }

        // 無視の配列は除く
        let tmpArr = [];
        for (let i = 0; i < resArr.length; i++) {
          if (resArr[i][PNT] !== AVOID_PNT) {
            tmpArr.push(resArr[i]);
          }
        }
        resArr = tmpArr;

        // 結果をポイント順でソート
        resArr = resArr.sort(this.srtKwPnt);
      }

      // 終了処理
      return resArr;
    };

    /**
     *	@variable	JpKw.srtKwPnt(a, b)
     *	@title	ソート（評価ポイント順）
     *	@description
     *
     *		キーワード配列を、評価ポイント順に並べ替えるためのソート用の比較子。
     */
    this.srtKwPnt = function (a, b) {
      // 同じポイント数ならソート（長い順と同じ）
      if (b[PNT] === a[PNT]) {
        // 同じ長さなら数の多さで判定
        if (b[KW].length === a[KW].length) {
          return b[CNT] - a[CNT];
        }
        if (b[CNT] === a[CNT]) {
          return b[KW].length - a[KW].length;
        }

        // 文字列長で判定
        return b[KW].length - a[KW].length;
      }

      // ポイント数で判定
      return b[PNT] - a[PNT];
    };
  },
};
