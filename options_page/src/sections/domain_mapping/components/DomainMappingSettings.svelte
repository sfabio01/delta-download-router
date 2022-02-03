<script>
    import { options } from "./../../../stores";

    function setUrlMappingMode(mode) {
        chrome.storage.local.set({ urlMappingMode: mode }, function () {
            options.update((o) => {
                o["urlMappingMode"] = mode;
                return o;
            });
        });
    }
</script>

<main>
    <div class="box">
        <div class="row align-items-center">
            <div class="col-8">
                <div class="title">URL mapping mode</div>
                <div class="subtitle">
                    Choose whether to map only the specific URL or also all the
                    URLs starting with it
                </div>
            </div>

            <div class="col text-end">
                <div class="dropdown">
                    <button
                        class="btn btn-primary dropdown-toggle"
                        type="button"
                        id="mappingModeDropdown"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                        >{$options["urlMappingMode"]
                            ? $options["urlMappingMode"][0].toUpperCase() +
                              $options["urlMappingMode"].substr(1)
                            : "Select"}</button
                    >
                    <ul
                        class="dropdown-menu"
                        aria-labelledby="mappingModeDropdown"
                    >
                        <li>
                            <button
                                class="dropdown-item"
                                type="button"
                                on:click={() => setUrlMappingMode("specific")}
                            >
                                Specific</button
                            >
                        </li>
                        <li>
                            <button
                                class="dropdown-item"
                                type="button"
                                on:click={() =>
                                    setUrlMappingMode("startingWith")}
                            >
                                Starting with</button
                            >
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</main>
