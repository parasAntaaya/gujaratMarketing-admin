import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

// Define styles for your PDF
export const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    backgroundColor: "#E4E4E4",
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    borderBottom: 1,
    borderColor: "#000",
    padding: 8,
  },
  cell: {
    flex: 1,
    textAlign: "center",
  },
});

// Create a custom PDF component
const PDFDocument = (data) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.header}>Daily Route Report</Text>
          {data.map((item, index) => (
            <View key={index} style={styles.row}>
              <Text style={styles.cell}>{index + 1}</Text>
              <Text style={styles.cell}>{item.routeName}</Text>
              <Text style={styles.cell}>{item.driverName}</Text>
              {/* Add more columns as needed */}
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
};
export default PDFDocument;
