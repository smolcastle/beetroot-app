import React from "react";

class Music extends React.PureComponent {
  state = {
    play: false,
  };
  audio = new Audio(
    "https://firebasestorage.googleapis.com/v0/b/beetroot-2192b.appspot.com/o/song.mp3?alt=media&token=50d50162-be82-4f14-9a8d-bf73af128a0b"
  );

  componentDidMount() {
    this.audio.addEventListener("ended", () => this.setState({ play: false }));
  }

  componentWillUnmount() {
    this.audio.removeEventListener("ended", () =>
      this.setState({ play: false })
    );
  }

  togglePlay = () => {
    this.setState({ play: !this.state.play }, () => {
      this.state.play ? this.audio.play() : this.audio.pause();
    });
  };

  render() {
    const { play } = this.state;
    if (play) {
      return (
        <button
          type="button"
          onClick={this.togglePlay}
          className="absolute bottom-[25%] md:bottom-[30px] left-[41%] md:left-auto md:right-[30px] bg-contain h-[50px] md:h-20 w-[100px] md:w-40 bg-playing bg-no-repeat"
        />
      );
    }
    return (
      <button
        type="button"
        onClick={this.togglePlay}
        className="absolute bottom-[25%] md:bottom-[30px] left-[45%] md:left-auto md:right-[30px] bg-contain h-[50px] md:h-20 w-[50px] md:w-20 bg-play bg-no-repeat"
      />
    );
  }
}

export default Music;
