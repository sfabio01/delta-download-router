<script>
	import "./style.css";
	import * as utils from "./utils";

	let domain = "";
	let path = "";
	let obj = {};

	chrome.runtime.sendMessage("getURL", function (response) {
		domain = response[0];
		path = response[1];
		chrome.storage.local.get(domain, function (result) {
			if (result[domain]) {
				obj = result[domain];
			}
			console.log(obj);
		});
	});

	function addPathUnderDomain() {
		let folderInput = document.getElementById("pathInputFolder").value;
		let folder = folderInput.trim();

		if (!utils.pathIsValid(folder)) {
			folder = utils.tryCorrectPath(folder);
		}
		if (utils.pathIsValid(folder)) {
			chrome.storage.local.set(
				{
					[domain]: {
						folder: obj.folder ?? "",
						paths: {
							[path]: folder,
							...obj.paths,
						},
					},
				},
				function () {
					// DEBUG:
					console.log(
						"Rule added: {" +
							domain +
							"->" +
							path +
							": " +
							folder +
							"}"
					);

					obj = {
						folder: obj.folder ?? "",
						paths: {
							[path]: folder,
							...obj.paths,
						},
					};
					console.log(obj);
				}
			);
		} else {
			alert("Invalid folder path\n" + utils.prohibitedCharsMessage);
		}
	}
	function addDomain() {
		let folderInput = document.getElementById("domainInputFolder").value;
		let folder = folderInput.trim();

		if (!utils.pathIsValid(folder)) {
			folder = utils.tryCorrectPath(folder);
		}
		if (utils.pathIsValid(folder)) {
			chrome.storage.local.set(
				{ [domain]: { folder: folder, paths: obj.paths ?? {} } },
				function () {
					// DEBUG:
					console.log("Rule added: {" + domain + ": " + folder + "}");

					obj = { folder: folder, paths: obj["paths"] ?? {} };
					obj = obj;
				}
			);
		} else {
			alert("Invalid folder path\n" + utils.prohibitedCharsMessage);
		}
	}
	function openOptionsPage() {
		chrome.tabs.create({
			url: "./../options.html",
			active: true,
		});
	}
</script>

<main>
	<h1>Delta</h1>
	<div class="domain">{domain}</div>
	{#if obj["folder"]}
		<div class="folder">{obj["folder"]}</div>
	{:else}
		<div class="container-fluid">
			<div class="row align-items-center g-1">
				<img
					class="col-1"
					src="./../icons/help.svg"
					alt="help"
					title={utils.pathFormatMessage}
				/>
				<div class="col-8">
					<input
						id="domainInputFolder"
						type="text"
						class="form-control form-control-sm folder"
						placeholder="Add a folder"
					/>
				</div>
				<div class="col">
					<button class="btn btn-primary btn-sm" on:click={addDomain}>
						<img src="./../icons/add.svg" alt="add" /></button
					>
				</div>
			</div>
		</div>
	{/if}
	<div class="path">{path}</div>
	{#if obj["paths"] && obj["paths"][path]}
		<div class="folder">{obj["paths"][path]}</div>
	{:else}
		<div class="container-fluid">
			<div class="row align-items-center g-1">
				<img
					class="col-1"
					src="./../icons/help.svg"
					alt="help"
					title={utils.pathFormatMessage}
				/>
				<div class="col-8">
					<input
						id="pathInputFolder"
						type="text"
						class="form-control form-control-sm folder"
						placeholder="Add a folder"
					/>
				</div>
				<div class="col">
					<button
						class="btn btn-primary btn-sm"
						on:click={addPathUnderDomain}
					>
						<img src="./../icons/add.svg" alt="add" /></button
					>
				</div>
			</div>
		</div>
	{/if}

	<!-- svelte-ignore a11y-invalid-attribute -->
	<a on:click={openOptionsPage} href="">Options page</a>
</main>
