import React from "react";
import song from "../utils/song.mp3";

class Music extends React.PureComponent {
  state = {
    play: false,
  };
  audio = new Audio(song);

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
