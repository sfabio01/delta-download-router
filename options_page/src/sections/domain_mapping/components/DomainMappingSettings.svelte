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
    function setDefaultDomainMapping() {
        options.update((o) => {
            o["defaultDomainMapping"] = !o["defaultDomainMapping"];
            return o;
        });
        chrome.storage.local.set({
            defaultDomainMapping: $options["defaultDomainMapping"],
        });
    }
</script>

<main>
    <div class="box">
        <!-- URL Mapping Mode -->
        <div class="row align-items-center">
            <div class="col">
                <div class="title">URL mapping mode</div>
                <div class="subtitle">
                    Choose whether to map only the specific URL or also all the
                    URLs starting with it
                </div>
            </div>

            <div class="col-3 text-end">
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
        <!-- Default Domain Mapping -->
        <div class="row align-items-center">
            <div class="col">
                <div class="title">Default domain mapping</div>
                <div class="subtitle">
                    A new folder named as the domain is automatically created
                    inside the default download folder if none of the above
                    rules match
                </div>
            </div>

            <div class="col-2 text-end">
                <div class="form-switch">
                    <input
                        style="width: 40px; height: 20px;"
                        class="form-check-input"
                        type="checkbox"
                        id="defaultDomainMappingSwitch"
                        on:change={setDefaultDomainMapping}
                        bind:checked={$options["defaultDomainMapping"]}
                    />
                </div>
            </div>
        </div>
    </div>
</main>
