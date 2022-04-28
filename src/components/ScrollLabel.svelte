<script>
    export let title;
    export let body;
</script>

<section>
    <div
        class="label"
        class:invisible={!body}
    >
        <h4>
            {@html title}
        </h4>
        <p>
            {@html body}
        </p>
    </div>
</section>

<style lang="scss">
    section {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        padding: 50vh 0;

        @media (max-width: 719px) {
           padding: 80vh 0;
        }

        pointer-events: none;
        background: transparent;
    }

    .label {
        width: 90%;
        padding: 2rem 1.5rem 0.5rem 1.5rem;
        color: #000000;
        font-size: 1.25rem;
        background-color: rgba(255, 255, 255, 0.95);
        border: 1px solid #DDDBD9;
        border-radius: 1.5px;
        box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.1);
        box-sizing: border-box;
        user-select: none;

        &.invisible {
            visibility: hidden;
        }

        @media (min-width: 1012px) {
            max-width: 664px;
        }

        @media (max-width: 719px) {
            max-width: calc(100% - 32px);
        }

        h4 {
            margin: 0 0 0.25rem 0;
            font-size: 1.25rem;
            font-weight: 700;
        }

        p {
            margin: 0 0 1.5rem 0;
            line-height: 30px;
        }
    }
</style>