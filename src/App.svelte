<script>
    import { width, height } from './stores/dimensions';
    import { headerHeight, top, bottom, contentHeight } from './stores/devices';
    import { steps } from './stores/steps';
    
    import Scroller from '@sveltejs/svelte-scroller';
    import ScrollyVisualization from './components/ScrollyVisualization.svelte';
    import ScrollLabel from './components/ScrollLabel.svelte';
    import Sources from './components/Sources.svelte';

    let progress = 0;
    let ready = true;
</script>

<div
    class="wrapper"
    bind:clientWidth={$width}
    bind:clientHeight={$height}
>

  <div
      class="content"
      style="top: {$headerHeight}px;"
  >
      <Scroller
          top={$top}
          bottom={$bottom}
          bind:progress={progress}
      >
          <div
              slot="background"
              style="height: {$contentHeight}px;"
          >
              <ScrollyVisualization
                  width={$width}
                  progress={progress}
              />
          </div>
          <div slot="foreground">
              {#each $steps as { id, description, largeTick } (id)}
                  <ScrollLabel
                      title={largeTick ? description.title : ''}
                      body={description.body}
                  />
              {/each}
          </div>
      </Scroller>
  </div>
  <Sources />
</div>

<style lang="scss">
  .wrapper {
      position: relative;
      width: 100%;
      max-width: 996px;
      height: 100%;
      margin: 0 auto;
      padding: 0 1rem;
      color: #000000;
      background-color: #FFFFFF;
      pointer-events: none;
  }

  .content {
      width: 100%;
  }

  [slot="background"] {
      width: 100%;
  }

  [slot="foreground"] {
      width: 100%;
      background: transparent;
      overflow: hidden;
      pointer-events: none;
  }
</style>