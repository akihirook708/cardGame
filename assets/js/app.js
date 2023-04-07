(() => {
    // 全てのカード情報を入れる配列を宣言
    const cards = [];

    // s : スペード, d : ダイヤ, h : ハート, c : クローバー
    const suits = ['s', 'd', 'h', 'c'];

    class Card {
        constructor(suit, num) {
            this.suit = suit;
            this.num = num;
            this.front = `${this.suit}${('0' + this.num).slice(-2)}.svg`;
            return this;
        }
    }

    // カード情報を配列に格納
    for (let i = 0; i < suits.length; i++) {
        for (let j = 1; j <= 13; j++) {
            let card = new Card(suits[i], j);
            cards.push(card);
        }
    }

    // シャッフルする関数
    const shuffle = (arrays) => {
        const array = arrays.slice();
        for (let i = array.length - 1; i >= 0; i--) {
            const randomIndex = Math.floor(Math.random() * (i + 1));
            [array[i], array[randomIndex]] = [array[randomIndex], array[i]];
        }
        return array;
    };

    // 1枚目のカードの変数を宣言 最初はnull
    let firstCard = null;
    // setTimeoutを格納する変数
    let flipTimerId = NaN;

    // カードをめくった時の処理
    const flip = (e) => {
        let flippedCard = e.target;
        // カードにクラスbackがついていないか、flipTimerIdが動作しているとき
        if (!flippedCard.classList.contains('back') || flipTimerId) {
            return; //表のカードをクリックしても何も反応させない。
        }

        flippedCard.classList.remove('back'); //backを取り除いて、カードを表にする。

        // めくるのが1枚目の時
        if (firstCard === null) {
            firstCard = flippedCard; // めくったカードをfirstCardに設定
        } else {
            //2枚目だったら1枚目と比較して結果を判定する。
            if (firstCard.num === flippedCard.num) {
                //2枚が同じだった時、firstCardを初期値に戻す
                firstCard = null;
            } else {
                // 2枚が違う数字だった時の処理
                flipTimerId = setTimeout(function () {
                    // 2枚のカードを裏返す
                    firstCard.classList.add('back');
                    flippedCard.classList.add('back');
                    // 初期値に戻す
                    flipTimerId = NaN;
                    firstCard = null;
                }, 1300); // 1.3秒後に処理を完了
            }
        }
    };
    const table = document.querySelector('.table');
    // シャッフルし、HTML生成
    const shuffleCard = () => {
        const shuffled = shuffle(cards);
        for (let i = 0; i < suits.length; i++) {
            const tr = document.createElement('tr');
            table.appendChild(tr);
            for (let j = 0; j < 13; j++) {
                const td = document.createElement('td');
                td.num = shuffled[i*13+j].num;
                td.style.backgroundImage = `url(./assets/cards_svg/${
                    shuffled[i * 13 + j].front
                })`;
                td.classList.add('card', 'back');
                td.onclick = flip; // カードをクリックしたときの関数
                tr.appendChild(td);
            }
        }
    };
    shuffleCard();
})();
