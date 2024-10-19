'use strict';

(
    function () {
        const scrollUp = () => {
            window.scrollTo(0, window.scrollY - (window.innerHeight / 2));
        }

        const scrollDown = () => {
            window.scrollTo(0, window.scrollY + (window.innerHeight / 2));
        }

        const displayScrollIndicators = () => {
            const scrollIndicatorUp = document.getElementById('scroll-indicator-up');
            const scrollIndicatorDown = document.getElementById('scroll-indicator-down');
            
            if (window.scrollY > 0) {
                scrollIndicatorUp.style.display = 'block';
            } else {
                scrollIndicatorUp.style.display = 'none';
            }

            if (window.scrollY + window.innerHeight < document.documentElement.scrollHeight) {
                scrollIndicatorDown.style.display = 'block';
            } else {
                scrollIndicatorDown.style.display = 'none';
            }
        }

        const section1Score = () => {
            let totalScore = 0
            for (let i = 1; i < 6; i++) {
                const query = `input[name="q${i}"]:checked`;
                const element = document.querySelector(query);
                if (element) {
                    totalScore += parseInt(element.getAttribute('data-score'));
                }
            }
            return totalScore;
        }

        const onchoicechange = (e) => {
            const totalScore = section1Score();

            const section2 = document.getElementById('section2')
            if (totalScore >= 2) {
                section2.classList.remove('hidden');
            } else {
                section2.classList.add('hidden')
            }

            displayScrollIndicators();
            
            checkIfAssessmentReady(totalScore)
        }

        const checkIfAssessmentReady = (score) => {
            if (score === undefined) {
                score = section1Score()
            }

            const assessButton = document.getElementById('assessbutton');
            const checkedOptions = document.querySelectorAll('input[type="radio"]:checked');
            if (checkedOptions.length === 7) {
                // Ready
                assessButton.classList.remove('hidden');
                assessButton.scrollIntoView();
                return
            }

            if (checkedOptions.length >= 5 && score < 2) {
                assessButton.classList.remove('hidden');
                assessButton.scrollIntoView();
                return
            }

            assessButton.classList.add('hidden');
        }

        const onassessbuttonclick = (e) => {
            const score = section1Score();

            if (score < 2) {
                const dialog = document.getElementById('noactionrequired');
                dialog.showModal();
                return;
            }

            const qAchoice = document.querySelector('#section2 input[name="qA"]:checked');
            const qBchoice = document.querySelector('#section2 input[name="qB"]:checked');

            const qAresult = qAchoice ? qAchoice.getAttribute('data-response') : 'no';
            const qBresult = qBchoice ? qBchoice.getAttribute('data-response') : 'no';

            if (qAresult === 'no' && qBresult === 'no') {
                const dialog = document.getElementById('noactionrequired');
                dialog.showModal();
                return;
            }

            if (qAresult === 'yes' && qBresult === 'no') {
                const dialog = document.getElementById('educateandempower');
                dialog.showModal();
                return;
            }

            const dialog = document.getElementById('notifyteam');
            dialog.showModal();
        }

        document.addEventListener('DOMContentLoaded', (e) => {
            const section1Choices = document.querySelectorAll('input[type="radio"]');
            for (let i = 0; i < section1Choices.length; i++) {
                section1Choices[i].addEventListener('click', onchoicechange);
            }

            const assessButton = document.getElementById('assessbutton');
            assessButton.addEventListener('click', onassessbuttonclick);

            const backgroundButton = document.getElementById('backgroundbutton');
            backgroundButton.addEventListener('click', (e) => {
                document.getElementById('backgrounddialog').showModal();
            });

            const instructionsButton = document.getElementById('instructionsbutton');
            instructionsButton.addEventListener('click', (e) => {
                document.getElementById('instructionsdialog').showModal();
            });

            const scrollIndicatorUp = document.getElementById('scroll-indicator-up');
            const scrollIndicatorDown = document.getElementById('scroll-indicator-down');
            scrollIndicatorUp.addEventListener('click', scrollUp);
            scrollIndicatorDown.addEventListener('click', scrollDown);

            window.addEventListener('scroll', () => {
                displayScrollIndicators();
            });

            displayScrollIndicators();

            if ('scrollRestoration' in history) {
                history.scrollRestoration = 'manual';
            }

            window.scrollTo(0, 0);
        })
    }
)();
