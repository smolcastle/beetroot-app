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
          className="z-20 lg:absolute mt-10 ml-3 bottom-[8%] xs:bottom-[25%]  lg:left-auto lg:bottom-[30px] lg:right-[30px] lg:translate-x-0 bg-contain h-[50px] xs:h-20 w-[100px] xs:w-40 bg-playing bg-no-repeat"
        />
      );
    }
    return (
      <button
        type="button"
        onClick={this.togglePlay}
        className="lg:absolute mt-5 sm:mt-10 bottom-[8%] xs:bottom-[25%] lg:left-auto lg:bottom-[30px] lg:right-[30px] lg:translate-x-0 bg-contain h-[50px] xs:h-20 w-[50px] xs:w-20 bg-play bg-no-repeat"
      />
    );
  }
}

export default Music;
