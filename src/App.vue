<script setup>
import Calculator from "./views/Calculator.vue";
</script>

<template>
	<!--	<header-component class="header"></header-component>-->

	<div class="container-fluid">

		<main>

			<div class="col-10 mx-auto">
				<Calculator/>
			</div>

		</main>

	</div>

	<!--	<footer-component class="footer"></footer-component>-->
</template>

<style>
:root {
	--header-height: 7vh;
	--footer-height: 7vh;
}

.header {
	height: var(--header-height);
}

.container-fluid {
	min-height: calc(100vh - var(--header-height) - var(--footer-height));
}

.footer {
	height: var(--footer-height);
}
</style>
