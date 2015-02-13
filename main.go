package main

import (
	"bufio"
	"bytes"
	"fmt"
	"github.com/knieriem/markdown"
	"io/ioutil"
	"log"
	"os"
	"os/exec"
	"regexp"
	"strings"
)

func AfterFilter(html []byte) (out []byte, er error) {
	codeFilter := func(code []byte) []byte {
		inner := bytes.TrimSpace(code)
		inner = inner[len("<pre><code>"):]
		inner = inner[:len(inner)-len("</code></pre>")]
		inner = bytes.TrimSpace(inner)

		var lexer string

		if firstNewline := bytes.Index(inner, []byte{'\n'}); firstNewline != -1 {
			line := inner[0:firstNewline]

			if line[0] == '[' && line[len(line)-1] == ']' {
				lexer = string(line[1 : len(line)-1])
				inner = inner[firstNewline+1:]
			} else {
				return code
			}
		} else {
			return code
		}

		inner = bytes.Replace(inner, []byte("&quot;"), []byte("\""), -1)
		inner = bytes.Replace(inner, []byte("&lt;"), []byte("<"), -1)
		inner = bytes.Replace(inner, []byte("&gt;"), []byte(">"), -1)
		inner = bytes.Replace(inner, []byte("&amp;"), []byte("&"), -1)

		cmd := exec.Command("pygmentize", "-f", "html", "-l", lexer)
		cmd.Stdin = bytes.NewReader(inner)

		result, err := cmd.Output()
		if err != nil {
			er = fmt.Errorf("pygmentize -l %s: %v", lexer, err)
			return nil
		}

		return result
	}

	paragraphFilter := func(text []byte) []byte {
		text = bytes.Replace(text, []byte("'"), []byte("&rsquo;"), -1)
		return text
	}

	html = regexp.MustCompile("(?s)<pre><code>(.*?)</code></pre>").ReplaceAllFunc(
		html, codeFilter)

	if er != nil {
		return
	}

	html = regexp.MustCompile("(?s)<p>(.*?)</p>").ReplaceAllFunc(html, paragraphFilter)

	return html, nil
}

func Main() error {
	template, err := ioutil.ReadFile("template.html")
	if err != nil {
		return err
	}

	reader := bufio.NewReader(os.Stdin)

	var title string

	for {
		line, err := reader.ReadString('\n')
		if err != nil {
			return err
		}

		if strings.HasPrefix(line, "===") {
			break
		} else {
			title = line[:len(line)-1]
		}
	}

	md, err := ioutil.ReadAll(reader)
	if err != nil {
		return err
	}

	result := bytes.NewBuffer(nil)

	p := markdown.NewParser(nil)
	p.Markdown(bytes.NewReader(md), markdown.ToHTML(result))

	filtered, err := AfterFilter(result.Bytes())
	if err != nil {
		return err
	}

	template = bytes.Replace(template, []byte("{TITLE}"), []byte(title), -1)
	template = bytes.Replace(template, []byte("{CONTENT}"), filtered, -1)
	template = bytes.Replace(template, []byte("{NAME}"), []byte(os.Args[1]), -1)

	if _, err := os.Stdout.Write(template); err != nil {
		return err
	}

	return nil
}

func main() {
	if err := Main(); err != nil {
		log.Fatal(err)
	}
}
