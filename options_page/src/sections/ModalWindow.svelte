<main>
    <div id="open-modal" class="modal-window">
        <div>
            <a href="#" title="Close" class="modal-close">Close</a>
            <h1>
                <span style="font-size: xxx-large;">&#127881;</span> New Version
                1.3.0
            </h1>
            <div>
                <h3>What's new</h3>
                <ul>
                    <li>
                        <b>Default domain mapping</b><br />
                        Now you can choose to automatically create a new folder for
                        unmapped domains
                    </li>
                    <li>
                        <b>Leave a review</b><br />
                        I look forward to hearing your opinion about Delta. Click
                        on the "Rate this extension" button any time to leave a feedback
                    </li>
                    <li>
                        <b>Bug fixing</b>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</main>

<style lang="scss">
    .modal-window {
        position: fixed;
        background-color: rgba(255, 255, 255, 0.5);
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 999;
        visibility: hidden;
        opacity: 0;
        pointer-events: none;
        transition: all 0.3s;
        &:target {
            visibility: visible;
            opacity: 1;
            pointer-events: auto;
        }
        & > div {
            width: 500px;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            padding: 2em;
            background: white;
        }
        h1 {
            font-size: 150%;
            margin: 0 0 15px;
        }
    }

    .modal-close {
        color: #aaa;
        line-height: 50px;
        font-size: 80%;
        position: absolute;
        right: 0;
        text-align: center;
        top: 0;
        width: 70px;
        text-decoration: none;
        &:hover {
            color: black;
        }
    }

    a {
        color: inherit;
    }

    .modal-window {
        & > div {
            border-radius: 1rem;
        }
    }

    .modal-window div:not(:last-of-type) {
        margin-bottom: 15px;
    }
</style>
