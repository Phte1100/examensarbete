<template>
    <div class="marquee">
        <div class="marquee-content">
            <h1>Välkommen till Learnit!</h1>
            <p>Välkommen till Learnit! Din plattform för lärande och utveckling.</p>
        </div>
    </div>
</template>

<style scoped>
.marquee {
    overflow: hidden;
    white-space: nowrap;
    width: 30%;
    height: 80vh;
    padding: 10px 0;
    position: relative;
    float: right;
}

.marquee-content {
    position: absolute;
    animation: marquee 15s linear infinite;
    margin: 10px;
} 

@keyframes marquee {
    0% { transform: translateY(-100%); }
    100% { transform: translateY(100%); }
}
</style>