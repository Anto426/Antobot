class Time {
  constructor(timezone) {
    this.timezone =
      timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
  }

  setTimezone(tz) {
    this.timezone = tz;
  }

  static _pad(n) {
    return String(n).padStart(2, "0");
  }

  getCurrentTime() {
    if (this.timezone) {
      const parts = new Intl.DateTimeFormat("en-GB", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZone: this.timezone,
      }).formatToParts(new Date());
      const map = Object.fromEntries(parts.map((p) => [p.type, p.value]));
      return `${map.hour}:${map.minute}:${map.second}`;
    }
    const d = new Date();
    return `${Time._pad(d.getHours())}:${Time._pad(d.getMinutes())}:${Time._pad(
      d.getSeconds()
    )}`;
  }

  getCurrentTimestamp() {
    return Date.now();
  }

  getCurrentYear() {
    return new Date().getFullYear();
  }

  getTimestampByInput(year, month, day) {
    if (
      typeof year !== "number" ||
      typeof month !== "number" ||
      typeof day !== "number"
    ) {
      throw new TypeError("year, month e day devono essere numeri");
    }
    return new Date(year, month - 1, day).getTime();
  }

  setLocalTimezone() {
    if (this.timezone && typeof process !== "undefined" && process.env) {
      process.env.TZ = this.timezone;
    }
  }

  formatTimeDayscale(ms) {
    const totalMin = Math.floor(ms / 60000);
    const days = Math.floor(totalMin / 1440);
    const hours = Math.floor((totalMin % 1440) / 60);
    const mins = totalMin % 60;
    return `${days}d ${hours}h ${mins}m`;
  }

  formatTimeHoursscale(ms) {
    const totalSec = Math.floor(ms / 1000);
    const hours = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `${hours}h ${mins}m ${secs}s`;
  }

  formatDuration(ms) {
    return ms >= 24 * 3600 * 1000
      ? this.formatTimeDayscale(ms)
      : this.formatTimeHoursscale(ms);
  }

  formatDate(date = new Date()) {
    return date.toISOString().slice(0, 10);
  }

  formatTimestamp(ts = Date.now()) {
    const d = new Date(ts);
    return (
      d.toISOString().slice(0, 10) +
      " " +
      [d.getHours(), d.getMinutes(), d.getSeconds()]
        .map((n) => Time._pad(n))
        .join(":")
    );
  }
}

export default Time;
