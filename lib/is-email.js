const matcher = /.+\@.+\..+/;

export default function isEmail(string) {
  return matcher.test(string);
}
