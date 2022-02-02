<script>
    import * as utils from "./../../utils";

    export let priorityList;

    document.addEventListener("DOMContentLoaded", (event) => {
        var _el;

        function dragOver(e) {
            if (isBefore(_el, e.target))
                e.target.parentNode.insertBefore(_el, e.target);
            else e.target.parentNode.insertBefore(_el, e.target.nextSibling);
        }

        function dragStart(e) {
            e.dataTransfer.effectAllowed = "move";
            e.dataTransfer.setData("text/plain", null);
            _el = e.target;
        }
        function dragEnd(e) {
            let list = document.getElementById("priority-list");
            let listItems = list.getElementsByTagName("li");
            let newPriorityList = [];
            for (let item of listItems) {
                newPriorityList.push(item.ariaValueText);
            }

            chrome.storage.local.set(
                { priorityList: newPriorityList },
                function () {
                    // DEBUG:
                    // console.log("New priority list: " + newPriorityList);
                }
            );
        }

        function isBefore(el1, el2) {
            if (el2.parentNode === el1.parentNode)
                for (
                    var cur = el1.previousSibling;
                    cur && cur.nodeType !== 9;
                    cur = cur.previousSibling
                )
                    if (cur === el2) return true;
            return false;
        }

        let sortables = document.getElementsByClassName("sortable-item");
        for (let sortable of sortables) {
            sortable.addEventListener("dragstart", dragStart);
            sortable.addEventListener("dragover", dragOver);
            sortable.addEventListener("dragend", dragEnd);
        }
    });
</script>

<main>
    <h3>Rules priority</h3>
    <div class="box">
        <ol id="priority-list" style="font-weight: bold;">
            {#each priorityList as value}
                <li
                    aria-valuetext={value}
                    draggable="true"
                    class="sortable-item"
                >
                    {utils.priorityValueTextMap[value]}
                </li>
            {/each}
        </ol>
        <p class="hint-text" style="text-align: center;">
            Drag a list item to change its priority
        </p>
    </div>
</main>
