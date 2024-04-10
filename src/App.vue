<script setup>
import FooterComponent from "./components/footerComponent.vue";
import HeaderComponent from "./components/headerComponent.vue";
import Calculator from "./views/Calculator.vue";
</script>

<template>
	<HeaderComponent class="header"></HeaderComponent>

	<div class="container-fluid">

		<main>

			<div class="col-10 mx-auto">
				<Calculator/>
			</div>

		</main>

	</div>

	<FooterComponent class="footer"></FooterComponent>
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
	padding-bottom: 15px;
	padding-top: 15px;
}

.footer {
	height: var(--footer-height);
}
</style>
