(() => {
    // カードクラス
    class Card {
        constructor(suit, num) {
            this.suit = suit;
            this.num = num;
            this.front = `${this.suit}${('0' + this.num).slice(-2)}.svg`;
            return this;
        }
    }

    // シャッフル済みカードの山のクラス
    class Deck {
        constructor(suits,numbers,joker){
            this.array = [];
            // カード情報を配列に格納
            for (let i = 0; i < suits.length; i++) {
                for (let j = 0; j < numbers.length; j++) {
                    const card = new Card(suits[i], numbers[j]);
                    this.array.push(card);
                }
            }
            if(joker>0){
                for(let k = 0;k < joker; k++){
                    const card = new Card('j',99);
                    this.array.push(card);
                }
            }
            this.array = this.shuffle(this.array);
        }
        // シャッフルする関数
        shuffle = (arrays) => {
            const array = arrays.slice();
            for (let i = array.length - 1; i >= 0; i--) {
                const randomIndex = Math.floor(Math.random() * (i + 1));
                [array[i], array[randomIndex]] = [array[randomIndex], array[i]];
            }
            return array;
        };
        remain = () => {
            return this.array.length;
        };
        deal = (num) => {
            const cardArray = this.array.splice(0,num)
            return cardArray;
        };
    };

    //カードをクリックしたときの処理
    const clickCard = (e) => {
        const clickedCard = e.target;
        if(clickedCard.textContent === 'exchange'){
            clickedCard.textContent = '';
        }else{
            clickedCard.textContent = 'exchange';
        }
    };

    // document操作
    const $dom = document;
    const $cardTable = $dom.getElementById('js-yourCards');
    const $cardExchange = $dom.getElementById('js-cardExchange');

    // 初期カードの設定関数
    const setCard = (deck) => {
        const cards = deck.deal(5);
        const tr = $dom.createElement('tr');
        tr.setAttribute('id','js-cards');
        $cardTable.appendChild(tr);
        for (let i = 0; i < cards.length; i++) {
            const td = $dom.createElement('td');
            td.style.backgroundImage = `url(./assets/cards_svg/${
                cards[i].front
            })`;
            td.num = cards[i].num;
            td.suit = cards[i].suit;
            td.classList.add('card');
            td.onclick = clickCard;
            tr.appendChild(td);
        }
    };

    // 利用するカード番号の配列を作成、今回は１〜１３全て
    const numbers = [...Array(13)].map((_, i) => i+1);
    // s : スペード, d : ダイヤ, h : ハート, c : クローバー
    const suits = ['s', 'd', 'h', 'c'];
    // 初期カードの設定
    const deck = new Deck(suits,numbers,1);
    setCard(deck);

    // 役の判定
    const judgment = () => {
        let joker = 0;
        let suits = [];
        let numbers = [];
        let flash = 1;
        let matching = 0;
        let maxNumber = 0;
        let minNumber = 99;
        let sumNumber = 0;
        //結果カードより変数の集計
        const tr = $dom.getElementById('js-cards');
        const cards = tr.getElementsByTagName('td');
        for (let index = 0; index < cards.length; index++) {
            const suit = cards[index].suit;
            const num = cards[index].num;
            if (suit === 'j') {
                joker = 1;
            }else{
                suits.push(suit);
                if (suits[0] !== suit && flash === 1) {
                    flash = 0;
                }
                numbers.push(num);
                if (maxNumber < num) {
                    maxNumber = num;
                }
                if (minNumber > num) {
                    minNumber = num;
                }
                if (num === 1){
                    sumNumber = sumNumber + 14;
                }else{
                    sumNumber = sumNumber + num;
                }
            }
        }
        //５枚から２枚を選ぶ組み合わせで同じ番号である回数をカウント
        //ワンペア：１、ツーペア：２、スリーカード：３、フルハウス：４，フォーカード：６
        for (let i = 0; i < numbers.length - 1; i++) {
            for (let j = i+1; j < numbers.length; j++) {
                if (numbers[i] === numbers[j]) {
                    matching++;
                }
            }
        }
        //joker,flash,numbers及びmaxNumber,minNumber,sumNumberで結果判定
        const message = $dom.getElementById('js-message');
        if (matching === 1 && joker === 0) {
            message.textContent = 'ワンペア';
        }else if (matching === 1 && joker ===1) {
            message.textContent = 'スリーカード';
        }else if (matching === 2 && joker === 0){
            message.textContent = 'ツーペア';
        }else if ((matching === 2 && joker === 1) || matching === 4){
            message.textContent = 'フルハウス';
        }else if (matching === 3 && joker === 0){
            message.textContent = 'スリーカード';
        }else if ((matching === 3 && joker === 1) || (matching === 6 && joker === 0)){
            message.textContent = 'フォーカード';
        }else if (matching === 6 && joker === 1) {
            message.textContent = 'ファイブカード';
        }else if (maxNumber - minNumber <= 4 && flash === 0){
            message.textContent = 'ストレート';
        }else if (maxNumber - minNumber <= 4 && flash === 1){
            message.textContent = 'ストレートフラッシュ';
        }else if (sumNumber === 60 && flash === 0){
            message.textContent = 'ロイヤルストレート';
        }else if (sumNumber === 60 && flash === 1){
            message.textContent = 'ロイヤルストレートフラッシュ'
        }else if (flash === 1){
            message.textContent = 'フラッシュ';
        }else if(joker === 1){
            message.textContent = 'ワンペア';
        }else{
            message.textContent = '役無し'
        }
    };

    //Card Exchange ボタン押下時の処理
    $cardExchange.addEventListener('click',(e) => {
        e.preventDefault();
        e.target.classList.add('hidden');
        console.log(e.target)
        const message = $dom.getElementById('js-message');
        message.textContent = '';
        const tr = $dom.getElementById('js-cards');
        const tds = tr.getElementsByTagName('td');
        for(i=0;i < tds.length;i++){
            if(tds[i].textContent === 'exchange'){
                tds[i].textContent = '';
                const cards = deck.deal(1);
                tds[i].style.backgroundImage = `url(./assets/cards_svg/${
                    cards[0].front
                })`;
                tds[i].num = cards[0].num;
                tds[i].suit = cards[0].suit;
            };
        };
        judgment();
    });

})();