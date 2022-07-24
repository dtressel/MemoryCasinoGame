let numberofCards;
let wallet = 1000;
let walletGoal = 1000;
let walletBeforePlay;
let chosenCards = [];
let shuffledCards = [];
let moneyAnimationToggle = true;
let firstCard;
let firstCardIndex;
let secondCard;
let bet;
let matchCounter = 0;
let numberCardMultiplier;
let faceCardMultiplier;
let aceMultiplier;
let aceOfSpadesMultiplier;

const gameBoardDiv = document.querySelector('#game-board');
const plusDiv0 = document.querySelector('#plus-div0');
const minusDiv0 = document.querySelector('#minus-div0');
const plusDiv1 = document.querySelector('#plus-div1');
const minusDiv1 = document.querySelector('#minus-div1');
const moneyDisplay = document.querySelector('#money-display');

const homeScreenElements = document.querySelectorAll('.home-screen');
const rulesScreenElements = document.querySelectorAll('.rules-screen');
const aboutScreenElements = document.querySelectorAll('.about-screen');
const playScreenElements = document.querySelectorAll('.play-screen');
const allScreenElements = [homeScreenElements, rulesScreenElements, aboutScreenElements, playScreenElements];

const difficultyPopup = document.getElementById('choose-game-difficulty');
const betPopup = document.getElementById('choose-bet');
const gameOverPopup = document.getElementById('game-over');
const bustPopup = document.getElementById('bust-popup');
const chooseWalletPopup = document.getElementById('choose-wallet');
const startWalletPopup = document.getElementById('start-wallet');
const popupNodeList = document.querySelectorAll('.popup');

const homeScreenRulesButton = document.getElementById('home-screen-rules');
const homeScreenPlayButton = document.getElementById('home-screen-play');
const homeScreenAboutButton = document.getElementById('home-screen-about');
const backHomeButton = document.getElementById('back-home');
const easyButton = document.getElementById('easy');
const intermediateButton = document.getElementById('intermediate');
const difficultButton = document.getElementById('difficult');
const chooseBetSubmitButton = document.getElementById('choose-bet-submit');
const gameOverPlayAgainButton = document.getElementById('game-over-play-again');
const gameOverHomeScreenButton = document.getElementById('game-over-home-screen');
const bustPlayAgainButton = document.getElementById('bust-play-again');
const bustHomeScreenButton = document.getElementById('bust-home-screen');
const chooseWalletSubmitButton = document.getElementById('choose-wallet-submit');
const startWalletOkButton = document.getElementById('start-wallet-ok');
const closeXButtons = document.querySelectorAll('.closeX');

const invalidNotification = document.getElementById('invalid-notification');
const gameOverPopupWonOrLostSpan = document.getElementById('won-lost');
const gameOverPopupAmountSpan = document.getElementById('game-over-amount-won-lost');
const gameOverWalletValueSpan = document.getElementById('game-over-wallet-value');
const chooseWalletCurrentWalletSpan = document.getElementById('choose-wallet-current-wallet-amount');

const chooseBetInput = document.getElementById('choose-bet-input');
const chooseWalletReset = document.getElementById('choose-wallet-reset');
const chooseWalletCurrent = document.getElementById('choose-wallet-current');

homeScreenPlayButton.addEventListener('click', showDifficultyPopup);
homeScreenRulesButton.addEventListener('click', showRulesPage);
homeScreenAboutButton.addEventListener('click', showAboutPage);
backHomeButton.addEventListener('click', showHomePage);
easyButton.addEventListener('click', () => chooseDifficulty(10));
intermediateButton.addEventListener('click', () => chooseDifficulty(16));
difficultButton.addEventListener('click', () => chooseDifficulty(22));
chooseBetSubmitButton.addEventListener('click', chooseBet);
gameOverPlayAgainButton.addEventListener('click', showHomePageAndDifficultyPopup);
gameOverHomeScreenButton.addEventListener('click', showHomePage);
bustPlayAgainButton.addEventListener('click', showHomePageAndDifficultyPopup);
bustHomeScreenButton.addEventListener('click', showHomePage);
chooseWalletSubmitButton.addEventListener('click', chooseWallet);
startWalletOkButton.addEventListener('click', showBetPopup);
for (const closeX of closeXButtons) {
    closeX.addEventListener('click', closePopup);
}

function hideAllScreens() {
    for (const elementNodeList of allScreenElements) {
        for (const element of elementNodeList) {
            element.classList.add('element-off');
        }
    }
}

function showHomePage() {
    hideAllScreens();
    closePopup();
    for (const element of homeScreenElements) {
        element.classList.remove('element-off');
    }
    const rowContainers = document.querySelectorAll('.rowContainer');
    for (const container of rowContainers) {
        container.remove();
    }
}

function showRulesPage() {
    hideAllScreens();
    for (const element of rulesScreenElements) {
        element.classList.remove('element-off');
    }
}

function showAboutPage() {
    hideAllScreens();
    for (const element of aboutScreenElements) {
        element.classList.remove('element-off');
    }
}

function showPlayPage() {
    hideAllScreens();
    for (const element of playScreenElements) {
        element.classList.remove('element-off');
    }
}

function showDifficultyPopup() {
    animatePopup(difficultyPopup);
}

function chooseDifficulty(cards) {
    numberofCards = cards;
    if (numberofCards === 10) {
        numberCardMultiplier = 1.5;
        faceCardMultiplier = 2;
        aceMultiplier = 2.5;
        aceOfSpadesMultiplier = 4;
    } else if (numberofCards === 16) {
        numberCardMultiplier = 1.5;
        faceCardMultiplier = 2.5;
        aceMultiplier = 3.5;
        aceOfSpadesMultiplier = 6;
    } else {
        numberCardMultiplier = 1.5;
        faceCardMultiplier = 3;
        aceMultiplier = 4;
        aceOfSpadesMultiplier = 8;
    }
    hidePopup(difficultyPopup);
    if (wallet === 1000) {
        showPopup(startWalletPopup);
    } else {
        chooseWalletCurrentWalletSpan.textContent = wallet.toLocaleString('en-US');
        showPopup(chooseWalletPopup);
    }
}

function chooseWallet(event) {
    event.preventDefault();
    if (chooseWalletReset.checked) {
        wallet = 1000;
        walletGoal = 1000;
    } else {
        if (wallet < 120) {
            chooseBetInput.value = 10;
        } else if (wallet < 250) {
            chooseBetInput.value = 20;
        } else if (wallet < 500) {
            chooseBetInput.value = 50;
        }
    }
    hidePopup(chooseWalletPopup);
    chooseWalletCurrent.checked = true;
    showPopup(betPopup);
} 

function showBetPopup(event) {
    event.preventDefault();
    hidePopup(startWalletPopup);
    showPopup(betPopup);
}

function chooseBet(event) {
    event.preventDefault();
    bet = chooseBetInput.value;
    invalidNotification.textContent = '';
    chooseBetInput.value = 100;
    if (bet >= 10 && bet <= wallet/5 && Number.isInteger(bet/10)) {
        hidePopup(betPopup);
        showPlayPage();
        startGame();
    } else {
        const maxBet = Math.floor(wallet/50) * 10;
        if (maxBet === 10) {
            invalidNotification.textContent = "Please choose a bet of $10. You do not have enough money in your wallet for a larger bet amount."
        } else {
        invalidNotification.textContent = "Please choose a multiple of $10 between $10 and $" + maxBet + "."
        }
    }
}

function showHomePageAndDifficultyPopup() {
    showHomePage();
    showDifficultyPopup();
}

function closePopup() {
    for (const popup of popupNodeList) {
        hidePopup(popup);
    }
    invalidNotification.textContent = '';
}

function animatePopup(popup) {
    console.log('animate popup function');
    popup.classList.remove('element-off');
    popup.classList.add('popup-visible-animate');
}

function showPopup(popup) {
    popup.classList.remove('element-off');   
    popup.classList.add('popup-visible-no-animate');
}

function hidePopup(popup) {
    popup.classList.remove('popup-visible-animate');
    popup.classList.remove('popup-visible-animate');
    popup.classList.add('element-off');
}

function startGame() {
    walletBeforePlay = wallet;
    setWallet(wallet);
    chooseCards();
    shuffleCards();
    dealCards();
    initializeEventListeners();
}

function setWallet(amount) {
    let walletWithCommas = amount.toLocaleString('en-US');
    moneyDisplay.textContent = walletWithCommas; 
}

function chooseCards() {
    for (let i = 0; i < numberofCards/2; i++) {
        const card = Math.floor(Math.random() * 52);
        if (chosenCards.includes(card)) {
            i--;
        } else {
            chosenCards.push(card);
            chosenCards.push(card);
        }
    }
    console.log(chosenCards);
}

function shuffleCards() {
    while (0 < chosenCards.length) {
        const index = Math.floor(Math.random() * chosenCards.length);
        const arrayOfRemoved = chosenCards.splice(index, 1);
        shuffledCards.push(arrayOfRemoved[0]);
    }
    console.log(shuffledCards);
}

function dealCards() {
    const div0 = document.createElement('div');
    div0.setAttribute('id', 'rowContainer0');
    div0.classList.add('rowContainer');
    gameBoardDiv.append(div0);
    let currentDivContainer = div0;
    let i = 0;
    for (const cardId of shuffledCards) {
        const card = document.createElement('div');
        card.classList.add('card-div');
        const cardFrontImage = document.createElement('img');
        cardFrontImage.setAttribute('src', 'PNG-cards/' + shuffledCards[i] + '.png');
        cardFrontImage.setAttribute('id', 'frontPic' + i);
        cardFrontImage.classList.add('hidden', 'card');
        if (numberofCards === 10) {
            cardFrontImage.classList.add('card10');
        } else if (numberofCards === 16) {
            cardFrontImage.classList.add('card16');
        } else {
            cardFrontImage.classList.add('card22');
        }
        card.append(cardFrontImage);
        currentDivContainer.append(card);
        card.setAttribute('id', 'card' + i);
        const cardBackImage = document.createElement('img');
        cardBackImage.setAttribute('id', 'backPic' + i);
        cardBackImage.setAttribute('src', 'PNG-cards/card-back.png');
        cardBackImage.classList.add('card');
        if (numberofCards === 10) {
            cardBackImage.classList.add('card10');
        } else if (numberofCards === 16) {
            cardBackImage.classList.add('card16');
        } else {
            cardBackImage.classList.add('card22');
        }
        card.append(cardBackImage);
        i++;
        if ((shuffledCards.length < 22 && i === 5) || (shuffledCards.length > 21 && i === 7)) {
            const div1 = document.createElement('div');
            div1.setAttribute('id', 'rowContainer1');
            div1.classList.add('rowContainer');
            gameBoardDiv.append(div1);
            currentDivContainer = div1;
        }
        if ((shuffledCards.length < 22 && i === 11) || (shuffledCards.length > 21 && i === 15)) {
            const div2 = document.createElement('div');
            div2.setAttribute('id', 'rowContainer2');
            div2.classList.add('rowContainer');
            gameBoardDiv.append(div2);
            currentDivContainer = div2;
        }
    }
}

function initializeEventListeners() {
    for (let i = 0; i < shuffledCards.length; i++) {
        setEventListener(i);
    }
    gameBoardDiv.classList.remove('unclickable');
}

function setEventListener(cardIndex) {
    const cardDiv = document.getElementById('card' + cardIndex);
        cardDiv.addEventListener('click', (event) => {
            onCardClick(cardIndex, event);
        }, {once: true});
}

function onCardClick(index, event) {
    if (firstCard !== undefined) {
        gameBoardDiv.classList.toggle('unclickable');
        secondCard = shuffledCards[index];
        flipCard(index);
        if (firstCard === secondCard) {
            firstCard = undefined;
            matchAnimation (firstCardIndex, index);
            let winAmount;
            if (secondCard <= 35) {
                winAmount = bet * numberCardMultiplier;
            } else if (secondCard <= 47) {
                winAmount = bet * faceCardMultiplier;
            } else if (secondCard <= 50) {
                winAmount = bet * aceMultiplier;
            } else {
                winAmount = bet * aceOfSpadesMultiplier;
            }
            createMoneyAnimation('plus', winAmount);
            matchCounter++;
            if (matchCounter >= numberofCards/2) {
                setTimeout(gameOver, 500, walletGoal);
            } else {
            gameBoardDiv.classList.toggle('unclickable');
            }
        } else {
            firstCard = undefined;
            let makeClickable;
            if (wallet < bet) {
                bust();
                makeClickable = 0;
            } else {
                makeClickable = 1;
            }
            setTimeout (flipCard, 1000, firstCardIndex, index, makeClickable);
            setEventListener(index);
            setEventListener(firstCardIndex);
        }

    } else {
        createMoneyAnimation('minus', bet);
        firstCardIndex = index;
        firstCard = shuffledCards[index];
        flipCard(index);
    }
}

    function createMoneyAnimation(type, value) {
        let typeDiv;
        let sign;
        if (type === 'minus') {
            sign = '-$';
            if (moneyAnimationToggle) {
                typeDiv = minusDiv0;
            } else {
                typeDiv = minusDiv1;
            }  
            wallet = walletGoal;
            walletGoal -= value;
        } else {
            sign = '+$';
            if (moneyAnimationToggle) {
                typeDiv = plusDiv0;
            } else {
                typeDiv = plusDiv1;
            }  
            wallet = walletGoal;
            walletGoal += value;
        }
        typeDiv.textContent = sign + value;
        typeDiv.classList.add('minus-plus-transition');
        setTimeout(() => typeDiv.textContent = "", 2000);
        setTimeout(() => typeDiv.classList.remove('minus-plus-transition'), 2000);
        walletTransition(type, value);
        moneyAnimationToggle = !moneyAnimationToggle;
    }

        function walletTransition(type, value) {
            let delay = Math.floor(1000 / value);
            let length = delay * value;
            const id = setInterval(rollWallet, delay, type);
            setTimeout(stopRoll, length, id);
        }

            function rollWallet(type) {
                if (type === 'minus') {
                    wallet--;
                    setWallet(wallet);
                } else {
                    wallet++;
                    setWallet(wallet);
                }
            }

            function stopRoll(id) {
                clearInterval(id);
                setWallet(walletGoal);
                wallet = walletGoal;
            }

    function flipCard(card1Index, card2Index, makeClickable) {
        const backImg = document.querySelector('#backPic' + card1Index);
        const frontImg = document.querySelector('#frontPic' + card1Index);
        backImg.classList.toggle('hidden');
        frontImg.classList.toggle('hidden');
        if (card2Index !== undefined) {
            const backImg = document.querySelector('#backPic' + card2Index);
            const frontImg = document.querySelector('#frontPic' + card2Index);
            backImg.classList.toggle('hidden');
            frontImg.classList.toggle('hidden');
        }
        if (makeClickable == 1) {
            gameBoardDiv.classList.toggle('unclickable');
        }
    }

    function matchAnimation (card1Index, card2Index) {
        const firstCardDiv = document.querySelector('#frontPic' + card1Index);
        const secondCardDiv = document.querySelector('#frontPic' + card2Index);
        toggleMatchBorder ();
        function toggleMatchBorder () {
            firstCardDiv.classList.toggle('match-border');
            secondCardDiv.classList.toggle('match-border');
        }
        setTimeout(toggleMatchBorder, 1000);
    }

function gameOver(earlyWallet) {
    let walletAmountChange = earlyWallet-walletBeforePlay;
    let result;
    shuffledCards = [];
    matchCounter = 0;
    if (walletAmountChange >= 0) {
        result = 'won';
    } else if (walletAmountChange < 0) {
        result = 'lost';
        walletAmountChange = walletAmountChange * -1;
    }
    gameOverPopupWonOrLostSpan.textContent = result;
    gameOverPopupAmountSpan.textContent = walletAmountChange.toLocaleString('en-US');
    gameOverWalletValueSpan.textContent = earlyWallet.toLocaleString('en-US');
    animatePopup(gameOverPopup);
}

function bust() {
    shuffledCards = [];
    matchCounter = 0;
    animatePopup(bustPopup);
    if (walletGoal < 11) {
        setTimeout(walletBustChange, 1000);
    }
}

function walletBustChange () {
    wallet = 1000;
    walletGoal = 1000;
}