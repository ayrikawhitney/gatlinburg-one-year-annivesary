BASEDIR=$(dirname $0)
INPUT_FILE=$BASEDIR/thanks_obama_content.xlsx
OUTPUT_FILE=$BASEDIR/data/events.json

rm $OUTPUT_FILE
in2csv $INPUT_FILE | csvjson > $OUTPUT_FILE
